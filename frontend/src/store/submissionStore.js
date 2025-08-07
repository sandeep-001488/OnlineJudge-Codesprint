"use client";
import axios from "axios";
import { create } from "zustand";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useSubmissionStore = create((set, get) => ({
  submissions: [],
  currentSubmission: null,
  isLoading: false,
  error: null,

  createSubmission: async (submissionData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}submissions`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Optionally, push to existing list
        set((state) => ({
          submissions: [response.data.submission, ...state.submissions],
          isLoading: false,
        }));
        return response.data.submission;
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create submission";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  getAllSubmissions: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set({ submissions: response.data.submissions, isLoading: false });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch submissions";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },
  getMySubmissions: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}submissions/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set({ submissions: response.data.submissions, isLoading: false });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch your submissions";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  getSubmissionsByProblem: async (problemId, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}submissions/problem/${problemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set({ submissions: response.data.submissions, isLoading: false });
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch submissions by problem";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  getSubmissionById: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}submissions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        set({ currentSubmission: response.data.submission, isLoading: false });
        return response.data.submission;
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch submission";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  deleteSubmission: async (id, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}submissions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        set((state) => ({
          submissions: state.submissions.filter((s) => s._id !== id),
          currentSubmission:
            state.currentSubmission?._id === id
              ? null
              : state.currentSubmission,
          isLoading: false,
        }));
        toast.success("Submission deleted successfully");
        return true;
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete submission";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  setCurrentSubmission: (submission) => set({ currentSubmission: submission }),

  clearCurrentSubmission: () => set({ currentSubmission: null }),

  clearSubmissions: () => set({ submissions: [], error: null }),

  clearError: () => set({ error: null }),

  resetStore: () =>
    set({
      submissions: [],
      currentSubmission: null,
      isLoading: false,
      error: null,
    }),
}));
