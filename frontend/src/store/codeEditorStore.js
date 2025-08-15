import { create } from "zustand";
import { persist } from "zustand/middleware";

const languages = [
  {
    value: "cpp",
    label: "C++",
    version: "GCC 11.2.0",
    template: `#include<iostream>
using namespace std;

int main() {
    // Your solution here
    return 0;
}`,
  },
  {
    value: "python",
    label: "Python",
    version: "3.9.7",
    template: `# Your solution here
def solve():
    pass

solve()`,
  },
  {
    value: "java",
    label: "Java",
    version: "OpenJDK 17",
    template: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your solution here
    }
}`,
  },
  {
    value: "javascript",
    label: "JavaScript",
    version: "Node.js 18",
    template: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Your solution here`,
  },
];

export const useCodeEditorStore = create(
  persist(
    (set, get) => ({
      currentProblemId: null,
      selectedLanguage: "cpp",

      code: {}, 
      customInputs: {}, 
      setCurrentProblem: (problemId, userId) => {
        if (!userId) return;
        set({ currentProblem: `${problemId}_${userId}` });
      },

      setSelectedLanguage: (language) => {
        set({ selectedLanguage: language });
      },

      setCode: (problemId, language, code, userId) => {
        if (!userId) return;
        const key = `${problemId}_${language}_${userId}`;
        set((state) => ({
          code: {
            ...state.code,
            [key]: code,
          },
        }));
      },

      getCode: (problemId, language, userId) => {
        if (!userId) return "";
        const key = `${problemId}_${language}_${userId}`;
        const state = get();
        return state.code[key] || "";
      },

      resetCodeForProblem: (problemId, language, userId) => {
        if (!userId) return;
        const key = `${problemId}_${language}_${userId}`;
        const languageConfig = languages.find((l) => l.value === language);
        const template = languageConfig?.template || "";

        set((state) => ({
          code: {
            ...state.code,
            [key]: template,
          },
        }));
      },

      setCustomInput: (problemId, input, userId) => {
        if (!userId) return;
        const key = `${problemId}_${userId}`;
        set((state) => ({
          customInputs: {
            ...state.customInputs,
            [key]: input,
          },
        }));
      },

      getCustomInput: (problemId, userId) => {
        if (!userId) return "";
        const key = `${problemId}_${userId}`;
        const state = get();
        return state.customInputs[key] || "";
      },

      clearUserCode: (userId) => {
        if (!userId) return;
        const state = get();
        const newCode = {};
        const newCustomInputs = {};

        Object.keys(state.code || {}).forEach((key) => {
          if (!key.endsWith(`_${userId}`)) {
            newCode[key] = state.code[key];
          }
        });

        Object.keys(state.customInputs || {}).forEach((key) => {
          if (!key.endsWith(`_${userId}`)) {
            newCustomInputs[key] = state.customInputs[key];
          }
        });

        set({
          code: newCode,
          customInputs: newCustomInputs,
        });
      },
    }),
    {
      name: "code-editor-storage",
      version: 1,
    }
  )
);