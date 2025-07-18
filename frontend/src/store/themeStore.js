import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light",
      isHydrated: false,

      setHydrated: () => {
        set({ isHydrated: true });
      },

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle(
            "dark",
            newTheme === "dark"
          );
        }
      },

      initializeTheme: () => {
        if (typeof window !== "undefined") {
          const currentTheme = get().theme;
          document.documentElement.classList.toggle(
            "dark",
            currentTheme === "dark"
          );
        }
      },

      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },
    }),
    {
      name: "theme-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);
