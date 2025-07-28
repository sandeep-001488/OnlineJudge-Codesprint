"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useCodeMirrorEditor } from "@/hooks/useCodeEditor";
import { HeroSection } from "@/components/CompilerHeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { CodeEditor } from "@/components/CodeEditor";
import { TestCasesSection } from "@/components/TestCasesSection";
import { CustomInput } from "@/components/CustomInput";
import { ActionButtons } from "@/components/ActionButtons";
import { OutputPanel } from "@/components/OutputPanel";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

const ProblemPage = () => {
  const router = useRouter();
  const params = useParams();
  const problemId = params?.id;

  const { isInitialized, isLoggedIn, authHydrated, checkAuth, token } =
    useAuthStore();

  // Problem data state
  const [problem, setProblem] = useState(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [problemError, setProblemError] = useState(null);

  // Code execution states
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [memoryUsed, setMemoryUsed] = useState(null);
  const [error, setError] = useState(null);
  const [errorLine, setErrorLine] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (authHydrated && !isInitialized) {
      checkAuth();
    }
  }, [authHydrated, isInitialized]);

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.push("/login");
    }
  }, [isInitialized, isLoggedIn]);

 
  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) {
        setProblemError("Problem ID not found");
        setIsLoadingProblem(false);
        return;
      }

      try {
        setIsLoadingProblem(true);
        setProblemError(null);

        const response = await axios.get(
          `http://localhost:5000/api/problems/${problemId}`,
          {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        const data = response.data;
        console.log("from problem id page ", data.problem.title);
        setProblem({
          title: data.problem.title,
          description: data.problem.description,
          inputFormat: data.problem.inputFormat,
          outputFormat: data.problem.outputFormat,
          constraints: data.problem.constraints,
          sampleTestCases:
            data.problem.sampleTestCases || data.problem.testCases || [],
          difficulty: data.problem.difficulty,
          tags: data.problem.tags || [],
        });
      } catch (error) {
        console.error("Error fetching problem:", error);

        // Handle axios-specific errors
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          if (status === 404) {
            setProblemError("Problem not found");
          } else if (status === 401) {
            setProblemError("Unauthorized access");
          } else {
            setProblemError(`Failed to fetch problem: ${status}`);
          }
        } else if (error.request) {
          // Request was made but no response received
          setProblemError("Network error: Unable to connect to server");
        } else {
          // Something else happened
          setProblemError(error.message || "An unexpected error occurred");
        }
      } finally {
        setIsLoadingProblem(false);
      }
    };

    if (problemId && isInitialized) {
      fetchProblem();
    }
  }, [problemId, isInitialized, token]);

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

   useEffect(() => {
     const template =
       languages.find((l) => l.value === selectedLanguage)?.template || "";
     if (
       template &&
       (!code ||
         code.trim() === "" ||
         code ===
           `#include<iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`)
     ) {
       setCode(template);
     }
   }, []);


  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      if (error) {
        setError(null);
        setErrorLine(null);
      }
    },
    [error]
  );

  const { editorRef, highlightError, clearErrorHighlight } =
    useCodeMirrorEditor(selectedLanguage, code, handleCodeChange);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    const template = languages.find((l) => l.value === lang)?.template || "";
    setCode(template);
    setOutput("");
    setExecutionTime(null);
    setMemoryUsed(null);
    setError(null);
    setErrorLine(null);
    setTestCaseResults([]);
    setHasRun(false);
    clearErrorHighlight();
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
    const template =
      languages.find((l) => l.value === selectedLanguage)?.template || "";
    setCode(template);
    setOutput("");
    setExecutionTime(null);
    setMemoryUsed(null);
    setError(null);
    setErrorLine(null);
    setTestCaseResults([]);
    setCustomInput("");
    setShowInput(false);
    setHasRun(false);
    clearErrorHighlight();
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

    setIsRunning(true);
    setOutput("Compiling and executing...");
    setError(null);
    setErrorLine(null);
    setTestCaseResults([]);
    setHasRun(true);
    clearErrorHighlight();
    const startTime = Date.now();

    try {
      const results = [];
      let hasError = false;
      let errorInfo = null;

      for (let i = 0; i < problem.sampleTestCases.length; i++) {
        const testCase = problem.sampleTestCases[i];

        const response = await fetch("http://localhost:5000/api/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
          setErrorLine(result.line);
          if (result.line) {
            highlightError(result.line);
          }
          break;
        }

        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput || testCase.output,
          actualOutput: result.success ? result.output : result.error,
          passed:
            result.success &&
            result.output?.trim() ===
              (testCase.expectedOutput || testCase.output)?.trim(),
          error: !result.success ? result.error : null,
        });
      }

      if (!hasError && customInput.trim()) {
        const customResponse = await fetch("http://localhost:5000/api/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: selectedLanguage,
            code: code,
            input: customInput,
          }),
        });

        const customResult = await customResponse.json();
        if (customResult.success) {
          setOutput(customResult.output);
        } else if (!hasError) {
          setError({
            type: customResult.type || "runtime",
            message: customResult.error,
            line: customResult.line,
          });
          setErrorLine(customResult.line);
          hasError = true;
        }
      }

      const endTime = Date.now();
      const execTime = endTime - startTime;
      setExecutionTime(execTime);

      if (!hasError) {
        setTestCaseResults(results);
      }

      setTimeout(() => {
        const testCasesSectionElement =
          document.getElementById("testCases-section");
        const customInputSectionElement = document.getElementById(
          "customInput-section"
        );
        if (customInput.trim()) {
          if (customInputSectionElement) {
            customInputSectionElement.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          if (testCasesSectionElement) {
            testCasesSectionElement.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
    } catch (error) {
      const errorMessage = `Network Error: ${error.message}`;
      setError({
        type: "network",
        message: errorMessage,
        line: null,
      });
      setOutput(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    // Dummy submit function - implement later
    console.log("Submit clicked - implement later");
  };


  if (!problem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4 max-w-9xl">
        <HeroSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Problem Section with proper sticky positioning */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-hidden">
              <ProblemSection problem={problem} />
            </div>
          </div>

          {/* Right Side - Code Editor and Controls */}
          <div className="lg:col-span-1 space-y-4">
            <div className="sticky z-20 top-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pb-2">
              <ActionButtons
                isRunning={isRunning}
                onRunCode={runCode}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Code Editor */}
            <div className="relative z-10">
              <CodeEditor
                selectedLanguage={selectedLanguage}
                languages={languages}
                code={code}
                error={error}
                errorLine={errorLine}
                isCopied={isCopied}
                editorRef={editorRef}
                onLanguageChange={handleLanguageChange}
                onCopyCode={copyCode}
                onDownloadCode={downloadCode}
                onResetCode={resetCode}
              />
            </div>

            {/* Error Display - Show only when there's an error */}
            {error && (
              <ErrorDisplay
                error={error}
                errorLine={errorLine}
                output={output}
              />
            )}

            {/* Test Cases Section - Hide when there's an error */}
            {!error &&
              problem.sampleTestCases &&
              problem.sampleTestCases.length > 0 && (
                <div id="testCases-section">
                  <TestCasesSection
                    testCases={problem.sampleTestCases.slice(0, 3)}
                    testCaseResults={testCaseResults}
                    executionTime={executionTime}
                    isRunning={isRunning}
                  />
                </div>
              )}

            {/* Custom Input - Hide when there's an error */}
            {!error && (
              <div id="customInput-section">
                <CustomInput
                  customInput={customInput}
                  showInput={showInput}
                  onInputChange={setCustomInput}
                  onToggleInput={() => setShowInput(!showInput)}
                />
              </div>
            )}

            {/* Custom Output Panel - Only show if hasRun is true and custom input exists */}
            {!error && customInput.trim() && hasRun && (
              <OutputPanel
                isRunning={isRunning}
                output={output}
                customInput={customInput}
                executionTime={executionTime}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
