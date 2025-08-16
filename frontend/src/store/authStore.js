"use client";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const normalizeUser = (user) => {
  if (!user) return null;

  const normalizedUser = {
    ...user,
    _id: user._id || user.id,
    id: user.id || user._id,
  };

  return normalizedUser;
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      rememberMe: false,
      token: null,
      refreshToken: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      isInitialized: false,
      isHydrated: false,
      redirectUrl: null,

      setHydrated: () => {
        set({ isHydrated: true });
      },

      setRedirectUrl: (url) => {
        set({ redirectUrl: url });
      },

      clearRedirectUrl: () => {
        set({ redirectUrl: null });
      },

      getAndClearRedirectUrl: () => {
        const { redirectUrl } = get();
        get().clearRedirectUrl();
        return redirectUrl || "/";
      },

      refreshAccessToken: async () => {
        const { refreshToken, rememberMe } = get();

        if (!refreshToken) {
          console.log("No refresh token available");
          get().logout();
          return null;
        }

        try {
          console.log("Attempting to refresh token...");
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`,
            {
              refreshToken,
              rememberMe,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = res.data;

          set({
            token: accessToken,
            refreshToken: newRefreshToken || refreshToken,
          });

          console.log("Token refreshed successfully");
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

          const normalizedUser = normalizeUser(user);

          set({
            user: normalizedUser,
            token: accessToken,
            refreshToken,
            rememberMe: credentials.rememberMe || false,
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

      resetPassword: async (identifier, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}auth/reset-password`,
            { identifier, newPassword },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          set({ isLoading: false });
          return res.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Reset password failed";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },


      updateUsername: async (newUsername) => {
        const { token } = get();
        set({ isLoading: true, error: null });

        try {
          const res = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}auth/update-username`,
            { newUsername },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { user } = res.data;
          const normalizedUser = normalizeUser(user);

          set({
            user: normalizedUser,
            isLoading: false,
            error: null,
          });

          return res.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Failed to update username";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: (shouldRedirect = false) => {
        if (shouldRedirect && typeof window !== "undefined") {
          const currentUrl = window.location.pathname + window.location.search;
          set({ redirectUrl: currentUrl });
        }

        set({
          user: null,
          token: null,
          refreshToken: null,
          isLoggedIn: false,
          error: null,
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

          const normalizedUser = normalizeUser(res.data.user);

          set({
            user: normalizedUser,
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

                const normalizedUser = normalizeUser(res.data.user);

                set({
                  user: normalizedUser,
                  isLoggedIn: true,
                  isLoading: false,
                  isInitialized: true,
                });

                return;
              } catch (retryError) {
                console.log("Retry with new token failed:", retryError);
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

      getUserId: () => {
        const { user } = get();
        return user?._id || user?.id || null;
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        rememberMe: state.rememberMe,
        isLoggedIn: state.isLoggedIn,
        isInitialized: state.isInitialized,
        redirectUrl: state.redirectUrl,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.user) {
            state.user = normalizeUser(state.user);
          }
          state.setHydrated();
        }
      },
    }
  )
);
