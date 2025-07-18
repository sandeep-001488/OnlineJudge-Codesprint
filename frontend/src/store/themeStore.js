import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  theme: "light",

  toggleTheme: () => {
    const newTheme = get().theme === "light" ? "dark" : "light";
    set({ theme: newTheme });
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  },

  initializeTheme: () => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = prefersDark ? "dark" : "light";
      set({ theme: initialTheme });
      document.documentElement.classList.toggle(
        "dark",
        initialTheme === "dark"
      );
    }
  },
}));
