"use client";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      isInitialized: false,
      isHydrated: false,

      setHydrated: () => {
        set({ isHydrated: true });
      },

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
          const { user, accessToken } = res.data;

          if (typeof window !== "undefined") {
            localStorage.setItem("token", accessToken);
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
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        isInitialized: state.isInitialized,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);
