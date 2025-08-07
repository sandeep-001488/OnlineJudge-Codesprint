"use client";
import axios from "axios";
import { create } from "zustand";
import { toast } from "sonner";

export const useProblemStore = create((set, get) => ({
  problems: [],
  currentProblem: null,
  testCases: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },

  getAllProblems: async (page = 1, limit = 10, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}problems?${params}`
      );

      if (response.data.success) {
        set({
          problems: response.data.problems,
          pagination: response.data.pagination || {
            page,
            limit,
            total: response.data.problems.length,
            pages: 1,
          },
          isLoading: false,
        });
      } else {
        // Handle case where success is false
        set({
          error: response.data.message || "Failed to fetch problems",
          isLoading: false,
        });
        toast.error(response.data.message || "Failed to fetch problems");
      }
    } catch (error) {
      console.error("getAllProblems error:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch problems",
        isLoading: false,
      });
      toast.error("Failed to fetch problems");
    }
  },

  // Get problem by ID
  getProblemById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}problems/${id}`
      );

      if (response.data.success) {
        set({
          currentProblem: response.data.problem,
          isLoading: false,
        });
        return response.data.problem;
      }
    } catch (error) {
      console.error("getProblemById error:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch problem",
        isLoading: false,
      });
      toast.error("Failed to fetch problem");
    }
  },

  // Create problem
  createProblem: async (problemData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}problems/create`,
        problemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set((state) => ({
          problems: [response.data.problem, ...state.problems],
          isLoading: false,
        }));
        toast.success("Problem created successfully");
        return response.data.problem;
      }
    } catch (error) {
      console.error("createProblem error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create problem";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Update problem
  updateProblem: async (id, problemData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}problems/${id}`,
        problemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set((state) => ({
          problems: state.problems.map((p) =>
            p._id === id ? response.data.problem : p
          ),
          currentProblem:
            state.currentProblem?._id === id
              ? response.data.problem
              : state.currentProblem,
          isLoading: false,
        }));
        toast.success("Problem updated successfully");
        return response.data.problem;
      }
    } catch (error) {
      console.error("updateProblem error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update problem";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Delete problem
  deleteProblem: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}problems/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set((state) => ({
          problems: state.problems.filter((p) => p._id !== id),
          isLoading: false,
        }));
        toast.success("Problem deleted successfully");
      }
    } catch (error) {
      console.error("deleteProblem error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete problem";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Get test cases for a problem
  getTestCases: async (problemId, includePrivate = false, token = null) => {
    set({ isLoading: true, error: null });
    try {
      const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` },
            params: { includePrivate: includePrivate.toString() },
          }
        : { params: { includePrivate: includePrivate.toString() } };

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}testcases/problem/${problemId}`,
        config
      );

      if (response.data.success) {
        set({
          testCases: response.data.testCases,
          isLoading: false,
        });
        return response.data.testCases;
      }
    } catch (error) {
      console.error("getTestCases error:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch test cases",
        isLoading: false,
      });
      toast.error("Failed to fetch test cases");
    }
  },

  // Create test case
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
        set((state) => ({
          testCases: [...state.testCases, response.data.testCase],
          isLoading: false,
        }));
        toast.success("Test case created successfully");
        return response.data.testCase;
      }
    } catch (error) {
      console.error("createTestCase error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create test case";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Update test case
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
        set((state) => ({
          testCases: state.testCases.map((tc) =>
            tc._id === id ? response.data.testCase : tc
          ),
          isLoading: false,
        }));
        toast.success("Test case updated successfully");
        return response.data.testCase;
      }
    } catch (error) {
      console.error("updateTestCase error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update test case";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Delete test case
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
          isLoading: false,
        }));
        toast.success("Test case deleted successfully");
      }
    } catch (error) {
      console.error("deleteTestCase error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete test case";
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  // Search problems
  searchProblems: async (query, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters,
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}problems/search?${params}`
      );

      if (response.data.success) {
        set({
          problems: response.data.problems,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("searchProblems error:", error);
      set({
        error: error.response?.data?.message || "Failed to search problems",
        isLoading: false,
      });
      toast.error("Failed to search problems");
    }
  },

  clearCurrentProblem: () => set({ currentProblem: null }),

  clearTestCases: () => set({ testCases: [] }),

  clearError: () => set({ error: null }),
}));
