import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useAIStore = create(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,
      apiCallsCount: 0,
      lastResetTime: Date.now(),
      rateLimit: {
        max: 5,
        windowMs: 15 * 60 * 1000,
      },

      responses: {
        hint: null,
        optimization: null,
        errorExplanation: null,
        testCaseExplanation: null,
        hiddenTestCaseExplanation: null,
      },

      checkAndResetApiCalls: () => {
        const now = Date.now();
        const { lastResetTime, rateLimit } = get();

        if (now - lastResetTime >= rateLimit.windowMs) {
          set({
            apiCallsCount: 0,
            lastResetTime: now,
          });
        }
      },

      canMakeApiCall: () => {
        get().checkAndResetApiCalls();
        const { apiCallsCount, rateLimit } = get();
        return apiCallsCount < rateLimit.max;
      },

      getRemainingCalls: () => {
        get().checkAndResetApiCalls();
        const { apiCallsCount, rateLimit } = get();
        return Math.max(0, rateLimit.max - apiCallsCount);
      },

      getTimeUntilReset: () => {
        const { lastResetTime, rateLimit } = get();
        const elapsed = Date.now() - lastResetTime;
        const remaining = rateLimit.windowMs - elapsed;
        return Math.max(0, remaining);
      },

      incrementApiCalls: () => {
        set((state) => ({
          apiCallsCount: state.apiCallsCount + 1,
        }));
      },

      makeApiCall: async (endpoint, data, token) => {
        const state = get();

        if (!state.canMakeApiCall()) {
          const timeUntilReset = state.getTimeUntilReset();
          const minutes = Math.ceil(timeUntilReset / 60000);
          throw new Error(
            `Rate limit exceeded. Try again in ${minutes} minutes.`
          );
        }

        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}ai/${endpoint}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          state.incrementApiCalls();
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || error.message,
          });
          throw error;
        }
      },

      explainError: async (code, errorMessage, language, token) => {
        try {
          const response = await get().makeApiCall(
            "explain-error",
            {
              code,
              errorMessage,
              language,
            },
            token
          );

          set((state) => ({
            responses: {
              ...state.responses,
              errorExplanation: response.response,
              hint: null,
              optimization: null,
              testCaseExplanation: null,
            },
          }));

          return response;
        } catch (error) {
          console.error("Error explaining compilation error:", error);
          throw error;
        }
      },

      getHint: async ({ title, description, language, tags, token }) => {
        try {
          const response = await get().makeApiCall(
            "generate-hint",
            {
              problemTitle: title,
              problemDescription: description,
              language,
              tags,
            },
            token
          );

          set((state) => ({
            responses: {
              ...state.responses,
              hint: response.response,
              errorExplanation: null,
              optimization: null,
              testCaseExplanation: null,
            },
          }));

          return response;
        } catch (error) {
          console.error("Error getting hint:", error);
          throw error;
        }
      },
      explainVisibleTestCase: async (
        code,
        language,
        input,
        expectedOutput,
        actualOutput,
        token
      ) => {
        try {
          const response = await get().makeApiCall(
            "explain-visible-testcase",
            {
              code,
              input,
              expectedOutput,
              actualOutput,
              language,
            },
            token
          );

          set((state) => ({
            responses: {
              ...state.responses,
              testCaseExplanation: response.response,
              hint: null,
              errorExplanation: null,
              optimization: null,
            },
          }));

          return response;
        } catch (error) {
          console.error("Error explaining test case:", error);
          throw error;
        }
      },

      explainHiddenFailure: async (
        code,
        language,
        problemTitle,
        problemDescription,
        token
      ) => {
        try {
          const response = await get().makeApiCall(
            "explain-hidden-testcase-failure",
            {
              code,
              language,
              problemTitle,
              problemDescription,
            },
            token
          );

          set((state) => ({
            responses: {
              ...state.responses,
              hiddenTestCaseExplanation: response.response,
              hint: null,
              errorExplanation: null,
              optimization: null,
            },
          }));

          return response;
        } catch (error) {
          console.error("Error explaining hidden failure:", error);
          throw error;
        }
      },

      suggestOptimizations: async (
        code,
        language,
        problemTitle,
        problemDescription,
        token
      ) => {
        try {
          const response = await get().makeApiCall(
            "suggest-optimizations",
            {
              code,
              language,
              problemDescription,
              problemTitle,
            },
            token
          );

          set((state) => ({
            responses: {
              ...state.responses,
              optimization: response.response,
              hiddenTestCaseExplanation: null,
              hint: null,
              errorExplanation: null,
            },
          }));

          return response;
        } catch (error) {
          console.error("Error getting optimization suggestions:", error);
          throw error;
        }
      },

      clearResponse: (type) => {
        set((state) => ({
          responses: {
            ...state.responses,
            [type]: null,
          },
        }));
      },

      clearAllResponses: () => {
        set({
          responses: {
            hint: null,
            optimization: null,
            errorExplanation: null,
            testCaseExplanation: null,
            hiddenTestCaseExplanation: null,
          },
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "codesprint-ai-store",
      partialize: (state) => ({
        apiCallsCount: state.apiCallsCount,
        lastResetTime: state.lastResetTime,
        responses: state.responses,
      }),
    }
  )
);

export { useAIStore };
