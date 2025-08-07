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

      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          get().logout();
          return null;
        }

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`,
            { refreshToken }
          );

          const { accessToken } = res.data;
          set({ token: accessToken });
          return accessToken;
        } catch (error) {
          console.error("Token refresh failed:", error);
          get().logout();
          return null;
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
            credentials,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const { user, accessToken, refreshToken } = res.data;

          set({
            user,
            token: accessToken,
            refreshToken,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isLoggedIn: false,
        });
      },

      checkAuth: async () => {
        if (typeof window === "undefined") return;

        const { token, refreshToken } = get();

        if (!token && !refreshToken) {
          set({ isInitialized: true });
          return;
        }

        set({ isLoading: true });

        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          set({
            user: res.data.user,
            isLoggedIn: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          if (error.response?.status === 401 && refreshToken) {
            const newToken = await get().refreshAccessToken();
            if (newToken) {
              try {
                const res = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL}auth/me`,
                  {
                    headers: {
                      Authorization: `Bearer ${newToken}`,
                    },
                  }
                );
                set({
                  user: res.data.user,
                  isLoggedIn: true,
                  isLoading: false,
                  isInitialized: true,
                });
                return;
              } catch (retryError) {
                console.log("Retry failed:", retryError);
              }
            }
          }

          set({
            user: null,
            token: null,
            refreshToken: null,
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
        refreshToken: state.refreshToken,
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