import { useState, useEffect, useCallback } from "react";
import { useCodeMirrorEditor } from "@/hooks/useCodeEditor";
import { useCodeEditorStore } from "@/store/codeEditorStore";
import { useAIStore } from "@/store/aiStore";
import { useAuthStore } from "@/store/authStore";

const languages = [
  {
    value: "cpp",
    label: "C++",
    version: "GCC 11.2.0",
    template: `#include<iostream>\nusing namespace std;\n\nint main() {\n    // Your solution here\n    return 0;\n}`,
  },
  {
    value: "python",
    label: "Python",
    version: "3.9.7",
    template: `# Your solution here\ndef solve():\n    pass\n\nsolve()`,
  },
  {
    value: "java",
    label: "Java",
    version: "OpenJDK 17",
    template: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n       // Your solution here\n    }\n}`,
  },
  {
    value: "javascript",
    label: "JavaScript",
    version: "Node.js 18",
    template: `const readline = require('readline');\nconst rl = readline.createInterface({\n  });\n\n// Your solution here`,
  },
];

export const useCodeExecution = (problemId, problem) => {
  const { getUserId } = useAuthStore();
  const { clearAllResponses } = useAIStore();
  const userId = getUserId();

  const {
    selectedLanguage,
    setCurrentProblem,
    setSelectedLanguage,
    setCode,
    getCode,
    resetCodeForProblem,
    setCustomInput,
    getCustomInput,
  } = useCodeEditorStore();

  const code = getCode(problemId, selectedLanguage, userId);
  const customInput = getCustomInput(problemId, userId);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [memoryUsed, setMemoryUsed] = useState(null);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [customInputExecuted, setCustomInputExecuted] = useState(false);

  // Initialize problem and code template
  useEffect(() => {
    if (problemId && userId) {
      setCurrentProblem(problemId, userId);

      const currentCode = getCode(problemId, selectedLanguage, userId);
      if (!currentCode || currentCode.trim() === "") {
        const languageConfig = languages.find(
          (l) => l.value === selectedLanguage
        );
        if (languageConfig?.template) {
          setCode(problemId, selectedLanguage, languageConfig.template, userId);
        }
      }
    }
  }, [problemId, userId, selectedLanguage]);

  // Clear AI responses when problem changes
  useEffect(() => {
    if (problemId) {
      clearAllResponses();
    }
  }, [problemId, clearAllResponses]);

  const handleCodeChange = useCallback(
    (newCode) => {
      if (userId) {
        setCode(problemId, selectedLanguage, newCode, userId);
      }
      if (error) setError(null);
    },
    [problemId, selectedLanguage, setCode, error, userId]
  );

  const { editorRef, highlightError, clearErrorHighlight } =
    useCodeMirrorEditor(selectedLanguage, code, handleCodeChange);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setOutput("");
    setExecutionTime(null);
    setMemoryUsed(null);
    setError(null);
    setTestCaseResults([]);
    setHasRun(false);
    setCustomInputExecuted(false);
    clearErrorHighlight();
  };

  const handleCustomInputChange = (newInput) => {
    if (userId) {
      setCustomInput(problemId, newInput, userId);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const downloadCode = () => {
    const extensions = {
      cpp: "cpp",
      python: "py",
      java: "java",
      javascript: "js",
    };
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solution.${extensions[selectedLanguage]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetCode = () => {
    if (userId) {
      resetCodeForProblem(problemId, selectedLanguage, userId);
    }
    setOutput("");
    setExecutionTime(null);
    setMemoryUsed(null);
    setError(null);
    setTestCaseResults([]);
    setHasRun(false);
    setCustomInputExecuted(false);
    clearErrorHighlight();
  };

  const validateInput = (code, language) => {
    const inputPatterns = {
      cpp: /cin\s*>>\s*\w+|getline\s*\(|scanf\s*\(/,
      python: /input\s*\(|sys\.stdin|raw_input\s*\(/,
      java: /Scanner|BufferedReader|System\.in/,
      javascript: /readline|process\.stdin/,
    };

    const hasInputHandling = inputPatterns[language]?.test(code);
    const hasTestCaseInput = problem?.sampleTestCases?.some(
      (tc) => tc.input && tc.input.trim() !== ""
    );
    return { hasInputHandling, hasTestCaseInput };
  };

  const runCode = async () => {
    if (!problem || !problem.sampleTestCases) {
      setError({
        type: "system",
        message: "Problem data not loaded",
        line: null,
      });
      return;
    }

    const { hasInputHandling, hasTestCaseInput } = validateInput(
      code,
      selectedLanguage
    );

    if (hasTestCaseInput && !hasInputHandling && !customInput.trim()) {
      setError({
        type: "input_validation",
        message: `This problem requires input, but your code doesn't seem to read any input. Add input handling code or provide custom input.`,
        line: null,
      });
      return;
    }

    setIsRunning(true);
    setOutput("Compiling and executing...");
    setError(null);
    setTestCaseResults([]);
    setHasRun(true);
    setCustomInputExecuted(false);
    clearErrorHighlight();
    clearAllResponses();

    try {
      const results = [];
      let hasError = false;
      let errorInfo = null;

      // Run test cases
      for (let i = 0; i < problem.sampleTestCases.length; i++) {
        const testCase = problem.sampleTestCases[i];
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: selectedLanguage,
            code: code,
            input: testCase.input,
          }),
        });

        const result = await response.json();

        if (!result.success && !hasError) {
          hasError = true;
          errorInfo = {
            type: result.type || "runtime",
            message: result.error,
            line: result.line,
          };
          setError(errorInfo);
          if (result.line) highlightError(result.line);
          break;
        }

        const actualOutput = result.output?.trim() || "";
        const expectedOutput = testCase.expectedOutput?.trim() || "";

        if (result.success && result.executionTime)
          setExecutionTime(result.executionTime);
        if (result.success && result.memory) setMemoryUsed(result.memory);

        if (!actualOutput && expectedOutput && hasTestCaseInput) {
          results.push({
            testCase: i + 1,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput:
              "No output - Check if your code reads input correctly",
            passed: false,
            error: "Possible input reading issue",
          });
        } else {
          results.push({
            testCase: i + 1,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: actualOutput || "No output",
            passed: result.success && actualOutput === expectedOutput,
            error: !result.success ? result.error : null,
          });
        }
      }

      // Run custom input if provided
      if (!hasError && customInput.trim()) {
        const customResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}run`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              language: selectedLanguage,
              code: code,
              input: customInput,
            }),
          }
        );

        const customResult = await customResponse.json();
        if (customResult.success) {
          setOutput(customResult.output);
          setCustomInputExecuted(true);
          if (customResult.executionTime)
            setExecutionTime(customResult.executionTime);
          if (customResult.memory) setMemoryUsed(customResult.memory);
        } else if (!hasError) {
          setError({
            type: customResult.type || "runtime",
            message: customResult.error,
            line: customResult.line,
          });
          hasError = true;
        }
      }

      if (!hasError) {
        setTestCaseResults(results);
      }
    } catch (error) {
      const errorMessage = `Network Error: ${error.message}`;
      setError({ type: "network", message: errorMessage, line: null });
      setOutput(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    selectedLanguage,
    code,
    customInput,
    output,
    isRunning,
    executionTime,
    memoryUsed,
    error,
    testCaseResults,
    hasRun,
    customInputExecuted,
    isCopied,
    editorRef,
    handleLanguageChange,
    handleCodeChange,
    handleCustomInputChange,
    runCode,
    copyCode,
    downloadCode,
    resetCode,
  };
};
