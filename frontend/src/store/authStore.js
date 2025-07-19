"use client";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
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

          set({
            user,
            token: accessToken,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
        }
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
      },

      checkAuth: async () => {
        if (typeof window === "undefined") return;

        const { token } = get();

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
          console.log("Error response:", error.response?.data);
          set({
            user: null,
            token: null,
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
        token: state.token,
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
