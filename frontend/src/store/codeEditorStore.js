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

      codeStorage: {},

      customInputStorage: {},

      setCurrentProblem: (problemId) => {
        set({ currentProblemId: problemId });
      },

      setSelectedLanguage: (language) => {
        set({ selectedLanguage: language });
      },

      setCode: (problemId, language, code) => {
        const state = get();
        const newCodeStorage = {
          ...state.codeStorage,
          [problemId]: {
            ...state.codeStorage[problemId],
            [language]: code,
          },
        };
        set({ codeStorage: newCodeStorage });
      },

      getCode: (problemId, language) => {
        const state = get();
        const problemStorage = state.codeStorage[problemId];

        if (problemStorage && problemStorage[language]) {
          return problemStorage[language];
        }

        const languageConfig = languages.find((l) => l.value === language);
        return languageConfig?.template || "";
      },

      resetCodeForProblem: (problemId, language) => {
        const state = get();
        const languageConfig = languages.find((l) => l.value === language);
        const template = languageConfig?.template || "";

        const newCodeStorage = {
          ...state.codeStorage,
          [problemId]: {
            ...state.codeStorage[problemId],
            [language]: template,
          },
        };

        set({ codeStorage: newCodeStorage });
        return template;
      },

      setCustomInput: (problemId, input) => {
        const state = get();
        const newCustomInputStorage = {
          ...state.customInputStorage,
          [problemId]: input,
        };
        set({ customInputStorage: newCustomInputStorage });
      },

      getCustomInput: (problemId) => {
        const state = get();
        return state.customInputStorage[problemId] || "";
      },

      clearAll: () => {
        set({
          currentProblemId: null,
          selectedLanguage: "cpp",
          codeStorage: {},
          customInputStorage: {},
        });
      },
    }),
    {
      name: "code-editor-storage",
      version: 1,
    }
  )
);
