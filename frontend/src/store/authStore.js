"use client";
import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  isInitialized: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const { user, token } = res.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      set({ user, isLoggedIn: true, isLoading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null, isLoggedIn: false });
  },

  checkAuth: async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true });

    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({
        user: res.data.user,
        isLoggedIn: true,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      localStorage.removeItem("token");
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  // Remove the initialize function entirely
}));
