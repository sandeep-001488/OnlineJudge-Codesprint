// stores/useTestCaseStore.js
"use client";
import axios from "axios";
import { create } from "zustand";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

  getAllTestCases: async (page = 1, limit = 100, token) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await axios.get(`${API_BASE_URL}/testcases?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  
  getTestCasesByProblemId: async (
    problemId,
    includePrivate = true,
    token = null
  ) => {
    set({ isLoading: true, error: null });
    try {
      // Always include auth headers if token is available
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: {
          includePrivate: includePrivate.toString(),
          limit: 1000,
        },
      };

      console.log("Store - Making request:", {
        problemId,
        includePrivate,
        hasToken: !!token,
        config: {
          headers: config.headers,
          params: config.params,
        },
      });

      const response = await axios.get(
        `${API_BASE_URL}/testcases/problem/${problemId}`,
        config
      );

      if (response.data.success) {
        const testCases = response.data.testCases || [];
        console.log(
          `Store - Fetched ${testCases.length} test cases for problem ${problemId}`,
          {
            includePrivate,
            hasToken: !!token,
            publicCount: testCases.filter((tc) => tc.isPublic).length,
            privateCount: testCases.filter((tc) => !tc.isPublic).length,
            testCases: testCases.map((tc) => ({
              id: tc._id,
              isPublic: tc.isPublic,
            })),
          }
        );

        set({
          testCases,
          isLoading: false,
        });
        return testCases;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch test cases";

      console.error("Store - Error fetching test cases:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        hasToken: !!token,
      });

      set({
        error: errorMessage,
        isLoading: false,
        testCases: [],
      });
      toast.error(errorMessage);
      return [];
    }
  },

  getTestCaseById: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/testcases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        `${API_BASE_URL}/testcases/create`,
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
        `${API_BASE_URL}/testcases/${id}`,
        testCaseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedTestCase = response.data.testCase;
        console.log("Updated test case:", {
          id: updatedTestCase._id,
          isPublic: updatedTestCase.isPublic,
        });

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
      const response = await axios.delete(`${API_BASE_URL}/testcases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        `${API_BASE_URL}/testcases/bulk-create`,
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
        `${API_BASE_URL}/testcases/bulk-delete`,
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
        `${API_BASE_URL}/testcases/${id}/toggle-privacy`,
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

  // Validate test case format
  validateTestCase: async (testCaseData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/testcases/validate`,
        testCaseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set({ isLoading: false });
        toast.success("Test case format is valid");
        return response.data.validation;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Test case validation failed";
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error("Error validating test case:", error);
      toast.error(errorMessage);
      throw error;
    }
  },

  // Clear current test case
  clearCurrentTestCase: () => set({ currentTestCase: null }),

  // Clear test cases
  clearTestCases: () => set({ testCases: [], error: null }),

  // Clear error
  clearError: () => set({ error: null }),

  // Set current test case
  setCurrentTestCase: (testCase) => set({ currentTestCase: testCase }),

  // Reset store to initial state
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

  // Filter test cases locally
  filterTestCases: (filterFn) => {
    const state = get();
    const filteredTestCases = state.testCases.filter(filterFn);
    return filteredTestCases;
  },

  // Sort test cases locally
  sortTestCases: (sortFn) => {
    set((state) => ({
      testCases: [...state.testCases].sort(sortFn),
    }));
  },

  // Group test cases by problem
  groupTestCasesByProblem: () => {
    const state = get();
    return state.testCases.reduce((groups, testCase) => {
      const problemId = testCase.problemId;
      if (!groups[problemId]) {
        groups[problemId] = [];
      }
      groups[problemId].push(testCase);
      return groups;
    }, {});
  },

  // Get test case statistics
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

  // Update test case locally (for optimistic updates)
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
