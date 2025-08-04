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

  // New submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

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
      // Clear submission result when code changes
      if (submissionResult) {
        setSubmissionResult(null);
        setSubmissionError(null);
      }
    },
    [error, submissionResult]
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
    setSubmissionResult(null);
    setSubmissionError(null);
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
    setSubmissionResult(null);
    setSubmissionError(null);
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
    setSubmissionResult(null);
    setSubmissionError(null);
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

  // const handleSubmit = async () => {
  //   if (!problemId || !code.trim()) {
  //     setSubmissionError("Please write some code before submitting");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setSubmissionResult(null);
  //   setSubmissionError(null);
  //   setError(null);
  //   setErrorLine(null);
  //   clearErrorHighlight();

  //   try {
  //     // Fetch all test cases (including private ones) for this problem
  //     const testCasesResponse = await axios.get(
  //       `http://localhost:5000/api/testcases/problem/${problemId}?includePrivate=true`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const allTestCases = testCasesResponse.data.testCases || [];
  //     const hiddenTestCases = allTestCases.filter(
  //       (testCase) => !testCase.isPublic
  //     );

  //     if (hiddenTestCases.length === 0) {
  //       setSubmissionError("No hidden test cases found for this problem");
  //       return;
  //     }

  //     let allPassed = true;
  //     let failedTestCase = null;
  //     let compilationError = null;

  //     // Run code against all hidden test cases
  //     for (let i = 0; i < hiddenTestCases.length; i++) {
  //       const testCase = hiddenTestCases[i];

  //       const response = await fetch("http://localhost:5000/api/run", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           language: selectedLanguage,
  //           code: code,
  //           input: testCase.input,
  //         }),
  //       });

  //       const result = await response.json();

  //       // If there's a compilation or runtime error, stop immediately
  //       if (!result.success) {
  //         allPassed = false;
  //         compilationError = {
  //           type: result.type || "runtime",
  //           message: result.error,
  //           line: result.line,
  //         };

  //         setError(compilationError);
  //         setErrorLine(result.line);
  //         if (result.line) {
  //           highlightError(result.line);
  //         }
  //         break;
  //       }

  //       // Check if output matches expected output
  //       const actualOutput = result.output?.trim() || "";
  //       const expectedOutput = testCase.expectedOutput?.trim() || "";

  //       if (actualOutput !== expectedOutput) {
  //         allPassed = false;
  //         failedTestCase = i + 1;
  //         break;
  //       }
  //     }

  //     // Set submission result
  //     if (compilationError) {
  //       setSubmissionResult(null); // Don't show result if there's a compilation error
  //     } else if (allPassed) {
  //       setSubmissionResult({
  //         status: "accepted",
  //         message: "Accepted! All test cases passed.",
  //         totalTestCases: hiddenTestCases.length,
  //       });
  //     } else {
  //       setSubmissionResult({
  //         status: "wrong_answer",
  //         message: `Wrong Answer on hidden test case ${failedTestCase}`,
  //         totalTestCases: hiddenTestCases.length,
  //         failedTestCase,
  //       });
  //     }

  //     // Scroll to submission result
  //     setTimeout(() => {
  //       const submissionElement = document.getElementById("submission-result");
  //       if (submissionElement) {
  //         submissionElement.scrollIntoView({ behavior: "smooth" });
  //       }
  //     }, 100);
  //   } catch (error) {
  //     console.error("Submission error:", error);

  //     if (error.response) {
  //       const status = error.response.status;
  //       if (status === 404) {
  //         setSubmissionError("Test cases not found for this problem");
  //       } else if (status === 401) {
  //         setSubmissionError("Unauthorized access");
  //       } else {
  //         setSubmissionError(`Failed to submit: ${status}`);
  //       }
  //     } else if (error.request) {
  //       setSubmissionError("Network error: Unable to connect to server");
  //     } else {
  //       setSubmissionError(
  //         error.message || "An unexpected error occurred during submission"
  //       );
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async () => {
    if (!problemId || !code.trim()) {
      setSubmissionError("Please write some code before submitting");
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);
    setSubmissionError(null);
    setError(null);
    setErrorLine(null);
    clearErrorHighlight();

    try {
      const testCasesResponse = await axios.get(
        `http://localhost:5000/api/testcases/problem/${problemId}?includePrivate=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allTestCases = testCasesResponse.data.testCases || [];
      const hiddenTestCases = allTestCases.filter(
        (testCase) => !testCase.isPublic
      );

      if (hiddenTestCases.length === 0) {
        setSubmissionError("No hidden test cases found for this problem");
        return;
      }

      let failedCount = 0;
      let firstFailedTestCase = null;
      let compilationError = null;

      for (let i = 0; i < hiddenTestCases.length; i++) {
        const testCase = hiddenTestCases[i];

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

        if (!result.success) {
          compilationError = {
            type: result.type || "runtime",
            message: result.error,
            line: result.line,
          };
          setError(compilationError);
          setErrorLine(result.line);
          if (result.line) highlightError(result.line);
          break;
        }

        const actualOutput = result.output?.trim() || "";
        const expectedOutput = testCase.expectedOutput?.trim() || "";

        if (actualOutput !== expectedOutput) {
          failedCount++;
          if (firstFailedTestCase === null) {
            firstFailedTestCase = i + 1;
          }
        }
      }

      if (compilationError) {
        setSubmissionResult(null);
      } else if (failedCount === 0) {
        setSubmissionResult({
          status: "accepted",
          message: "All test cases passed.",
          totalTestCases: hiddenTestCases.length,
        });
      } else {
        setSubmissionResult({
          status: "wrong_answer",
          message: `Wrong Answer on ${failedCount} hidden test case(s). First failed at test case ${firstFailedTestCase}.`,
          totalTestCases: hiddenTestCases.length,
          failedTestCase: firstFailedTestCase,
          failedCount,
        });
      }

      setTimeout(() => {
        const submissionElement = document.getElementById("submission-result");
        if (submissionElement) {
          submissionElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setSubmissionError("Test cases not found for this problem");
        } else if (status === 401) {
          setSubmissionError("Unauthorized access");
        } else {
          setSubmissionError(`Failed to submit: ${status}`);
        }
      } else if (error.request) {
        setSubmissionError("Network error: Unable to connect to server");
      } else {
        setSubmissionError(
          error.message || "An unexpected error occurred during submission"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
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
                isSubmitting={isSubmitting}
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

            {submissionResult && (
              <div
                id="submission-result"
                className="bg-white dark:bg-slate-800 rounded-lg border shadow-sm p-6"
              >
                {/* Status Indicator */}
                <div
                  className={`flex items-center space-x-3 ${
                    submissionResult.status === "accepted"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      submissionResult.status === "accepted"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <h3 className="text-lg font-semibold">
                    {submissionResult.status === "accepted"
                      ? "Accepted"
                      : "Wrong Answer"}
                  </h3>
                </div>

                {/* Message */}
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {submissionResult.status === "accepted"
                    ? `🎉 Congratulations !! Your solution is correct`
                    : submissionResult.failedTestCase !== undefined &&
                      "Failed on a hidden test case"}
                </p>

                {/* Stats */}
                <div className="mt-3 text-sm font-semibold text-gray-500 dark:text-white">
                  {submissionResult.status === "accepted"
                    ? `Happy Coding 😊. Attack more problems !!`
                    : `${
                        submissionResult.totalTestCases -
                        submissionResult.failedCount
                      }/${submissionResult.totalTestCases} testcases passed`}
                </div>
              </div>
            )}

            {/* Submission Error */}
            {submissionError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h4 className="font-medium">Submission Error</h4>
                </div>
                <p className="mt-1 text-red-700 dark:text-red-300 text-sm">
                  {submissionError}
                </p>
              </div>
            )}

            {/* Error Display - Show only when there's an error */}
            {error && (
              <ErrorDisplay
                error={error}
                errorLine={errorLine}
                output={output}
              />
            )}

            {/* Test Cases Section - Hide when there's an error or submission result */}
            {!error &&
              !submissionResult &&
              problem.sampleTestCases &&
              problem.sampleTestCases.length > 0 && (
                <div id="testCases-section">
                  <TestCasesSection
                    testCases={problem.sampleTestCases.slice(0, 3).reverse()}
                    testCaseResults={testCaseResults}
                    executionTime={executionTime}
                    isRunning={isRunning}
                  />
                </div>
              )}

            {!error && !submissionResult && (
              <div id="customInput-section">
                <CustomInput
                  customInput={customInput}
                  showInput={showInput}
                  onInputChange={setCustomInput}
                  onToggleInput={() => setShowInput(!showInput)}
                />
              </div>
            )}

            {!error && !submissionResult && customInput.trim() && hasRun && (
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
