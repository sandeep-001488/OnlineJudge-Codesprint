"use client";
import axios from "axios";
import { create } from "zustand";
import { toast } from "sonner";

export const useProblemStore = create((set, get) => ({
  problems: [],
  currentProblem: null,
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
          pagination: {
            page: 1,
            limit: response.data.problems.length,
            total: response.data.problems.length,
            pages: 1,
          },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("searchProblems error:", error);
      set({
        error: error.response?.data?.message || "Failed to search problems",
        problems: [],
        isLoading: false,
      });
      toast.error("Failed to search problems");
    }
  },

  clearCurrentProblem: () => set({ currentProblem: null }),
  clearError: () => set({ error: null }),
}));
