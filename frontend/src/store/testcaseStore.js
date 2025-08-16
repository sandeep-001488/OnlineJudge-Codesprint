"use client";
import axios from "axios";
import { create } from "zustand";
import { toast } from "sonner";

export const useTestCaseStore = create((set, get) => ({
  testCases: [],
  currentTestCase: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 100,
    total: 0,
    pages: 0,
  },

  getTestCasesForViewing: async (problemId, token = null) => {
    set({ isLoading: true, error: null });
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: {
          includePrivate: "true", 
          limit: 1000,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/problem/${problemId}`,
        config
      );

      if (response.data.success) {
        const testCases = response.data.testCases || [];
        set({
          testCases,
          isLoading: false,
        });
        return testCases;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch test cases";
      set({
        error: errorMessage,
        isLoading: false,
        testCases: [],
      });
      toast.error(errorMessage);
      return [];
    }
  },

  getTestCasesForSubmission: async (problemId, token) => {
    set({ isLoading: true, error: null });
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          forSubmission: "true",
          limit: 1000,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/problem/${problemId}`,
        config
      );

      if (response.data.success) {
        const testCases = response.data.testCases || [];
        set({
          testCases,
          isLoading: false,
        });
        return testCases;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch test cases for submission";
      set({
        error: errorMessage,
        isLoading: false,
        testCases: [],
      });
      toast.error(errorMessage);
      return [];
    }
  },

  getPublicTestCases: async (problemId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/problem/${problemId}`,
        {
          params: {
            includePrivate: "false",
            limit: 1000,
          },
        }
      );

      if (response.data.success) {
        const testCases = response.data.testCases || [];
        set({
          testCases,
          isLoading: false,
        });
        return testCases;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch public test cases";
      set({
        error: errorMessage,
        isLoading: false,
        testCases: [],
      });
      toast.error(errorMessage);
      return [];
    }
  },

  getTestCasesByProblemId: async (
    problemId,
    { includePrivate = false, forSubmission = false, token = null } = {}
  ) => {
    set({ isLoading: true, error: null });
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: {
          includePrivate: includePrivate.toString(),
          forSubmission: forSubmission.toString(),
          limit: 1000,
        },
      };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/problem/${problemId}`,
        config
      );

      if (response.data.success) {
        const testCases = response.data.testCases || [];
        set({
          testCases,
          isLoading: false,
        });
        return testCases;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch test cases";
      set({
        error: errorMessage,
        isLoading: false,
        testCases: [],
      });
      toast.error(errorMessage);
      return [];
    }
  },

  getAllTestCases: async (page = 1, limit = 100, token) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}testcases?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set({
          testCases: response.data.testCases || [],
          pagination: response.data.pagination || {
            page,
            limit,
            total: response.data.testCases?.length || 0,
            pages: 1,
          },
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch test cases";
      set({
        error: errorMessage,
        isLoading: false,
        testCases: [],
      });
      console.error("Error fetching all test cases:", error);
      toast.error(errorMessage);
    }
  },

  getTestCaseById: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set({
          currentTestCase: response.data.testCase,
          isLoading: false,
        });
        return response.data.testCase;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch test case";
      set({
        error: errorMessage,
        isLoading: false,
        currentTestCase: null,
      });
      console.error("Error fetching test case:", error);
      toast.error(errorMessage);
      return null;
    }
  },

  createTestCase: async (testCaseData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/create`,
        testCaseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const newTestCase = response.data.testCase;
        console.log("Created test case:", {
          id: newTestCase._id,
          isPublic: newTestCase.isPublic,
        });

        set((state) => ({
          testCases: [...state.testCases, newTestCase],
          isLoading: false,
        }));
        toast.success("Test case created successfully");
        return newTestCase;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create test case";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("Error creating test case:", error);
      toast.error(errorMessage);
      throw error;
    }
  },

  updateTestCase: async (id, testCaseData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/${id}`,
        testCaseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedTestCase = response.data.testCase;

        set((state) => ({
          testCases: state.testCases.map((tc) =>
            tc._id === id ? updatedTestCase : tc
          ),
          currentTestCase:
            state.currentTestCase?._id === id
              ? updatedTestCase
              : state.currentTestCase,
          isLoading: false,
        }));
        toast.success("Test case updated successfully");
        return updatedTestCase;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update test case";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("Error updating test case:", error);
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteTestCase: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set((state) => ({
          testCases: state.testCases.filter((tc) => tc._id !== id),
          currentTestCase:
            state.currentTestCase?._id === id ? null : state.currentTestCase,
          isLoading: false,
        }));
        toast.success("Test case deleted successfully");
        return true;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete test case";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("Error deleting test case:", error);
      toast.error(errorMessage);
      throw error;
    }
  },

  bulkCreateTestCases: async (testCasesData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/bulk-create`,
        { testCases: testCasesData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        set((state) => ({
          testCases: [...state.testCases, ...(response.data.testCases || [])],
          isLoading: false,
        }));
        toast.success(
          `${
            response.data.testCases?.length || 0
          } test cases created successfully`
        );
        return response.data.testCases || [];
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create test cases";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("Error bulk creating test cases:", error);
      toast.error(errorMessage);
      throw error;
    }
  },

  bulkDeleteTestCases: async (testCaseIds, token) => {
    if (!testCaseIds || testCaseIds.length === 0) {
      toast.error("No test cases selected for deletion");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/bulk-delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { testCaseIds },
        }
      );

      if (response.data.success) {
        set((state) => ({
          testCases: state.testCases.filter(
            (tc) => !testCaseIds.includes(tc._id)
          ),
          currentTestCase: testCaseIds.includes(state.currentTestCase?._id)
            ? null
            : state.currentTestCase,
          isLoading: false,
        }));
        toast.success(`${testCaseIds.length} test cases deleted successfully`);
        return true;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete test cases";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("Error bulk deleting test cases:", error);
      toast.error(errorMessage);
      throw error;
    }
  },

  toggleTestCasePrivacy: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/${id}/toggle-privacy`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set((state) => ({
          testCases: state.testCases.map((tc) =>
            tc._id === id ? response.data.testCase : tc
          ),
          currentTestCase:
            state.currentTestCase?._id === id
              ? response.data.testCase
              : state.currentTestCase,
          isLoading: false,
        }));
        toast.success("Test case privacy updated successfully");
        return response.data.testCase;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update test case privacy";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("Error toggling test case privacy:", error);
      toast.error(errorMessage);
      throw error;
    }
  },

  // Utility methods
  clearCurrentTestCase: () => set({ currentTestCase: null }),
  clearTestCases: () => set({ testCases: [], error: null }),
  clearError: () => set({ error: null }),
  setCurrentTestCase: (testCase) => set({ currentTestCase: testCase }),

  resetStore: () =>
    set({
      testCases: [],
      currentTestCase: null,
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 100,
        total: 0,
        pages: 0,
      },
    }),

  filterTestCases: (filterFn) => {
    const state = get();
    return state.testCases.filter(filterFn);
  },

  getTestCaseStats: () => {
    const state = get();
    const total = state.testCases.length;
    const publicCount = state.testCases.filter((tc) => tc.isPublic).length;
    const privateCount = total - publicCount;

    return {
      total,
      public: publicCount,
      private: privateCount,
    };
  },

  updateTestCaseLocally: (id, updates) => {
    set((state) => ({
      testCases: state.testCases.map((tc) =>
        tc._id === id ? { ...tc, ...updates } : tc
      ),
      currentTestCase:
        state.currentTestCase?._id === id
          ? { ...state.currentTestCase, ...updates }
          : state.currentTestCase,
    }));
  },

  addTestCaseLocally: (testCase) => {
    set((state) => ({
      testCases: [...state.testCases, testCase],
    }));
  },

  removeTestCaseLocally: (id) => {
    set((state) => ({
      testCases: state.testCases.filter((tc) => tc._id !== id),
      currentTestCase:
        state.currentTestCase?._id === id ? null : state.currentTestCase,
    }));
  },
}));
