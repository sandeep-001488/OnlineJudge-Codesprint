"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCodeMirrorEditor } from "@/hooks/useCodeEditor";
import { HeroSection } from "@/components/CompilerHeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { CodeEditor } from "@/components/CodeEditor";
import { TestCasesSection } from "@/components/TestCasesSection";
import { CustomInput } from "@/components/CustomInput";
import { ActionButtons } from "@/components/ActionButtons";
import { OutputPanel } from "@/components/OutputPanel";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { SubmissionHistoryModal } from "@/components/SubmissionHistoryModel";
import { SubmissionCodeModal } from "@/components/SubmissionCodeModel";
import FloatingAIAssistant from "@/components/AIAssitant/FloatingAIAssistant";
import AIResponseDisplay from "@/components/AIAssitant/AIResponseDisplay";
import { useSubmissionStore } from "@/store/submissionStore";
import { useAuthStore } from "@/store/authStore";
import { useAIStore } from "@/store/aiStore";
import { useCodeEditorStore } from "@/store/codeEditorStore";
import { useTestCaseStore } from "@/store/testcaseStore";
import { useProblemStore } from "@/store/problemStore";
const ProblemPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const problemId = slug?.split("-").pop();
  const { responses, clearAllResponses } = useAIStore();

  const {
    isInitialized,
    isLoggedIn,
    authHydrated,
    checkAuth,
    token,
    user,
    getUserId, 
  } = useAuthStore();

  const userId = getUserId();
  const {
    createSubmission,
    getSubmissionsByProblem,
    submissions,
    isLoading: submissionLoading,
  } = useSubmissionStore();
  const { getProblemById } = useProblemStore();
  const { getTestCasesForSubmission } = useTestCaseStore();

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

  const [problem, setProblem] = useState(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [problemError, setProblemError] = useState(null);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [memoryUsed, setMemoryUsed] = useState(null);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [hasRun, setHasRun] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [customInputExecuted, setCustomInputExecuted] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adminFailedTestCase, setAdminFailedTestCase] = useState(null);

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

  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId || !userId) {
        if (isInitialized && !userId) {
          setProblemError("User not found");
        }
        setIsLoadingProblem(false);
        return;
      }

      try {
        setIsLoadingProblem(true);
        setProblemError(null);

        const problemData = await getProblemById(problemId);

        if (problemData) {
          setProblem({
            title: problemData.title,
            description: problemData.description,
            inputFormat: problemData.inputFormat,
            outputFormat: problemData.outputFormat,
            constraints: problemData.constraints,
            sampleTestCases:
              problemData.sampleTestCases || problemData.testCases || [],
            difficulty: problemData.difficulty,
            tags: problemData.tags || [],
          });

          const currentCode = getCode(problemId, selectedLanguage, userId);
          if (!currentCode || currentCode.trim() === "") {
            const languageConfig = languages.find(
              (l) => l.value === selectedLanguage
            );
            if (languageConfig?.template) {
              setCode(
                problemId,
                selectedLanguage,
                languageConfig.template,
                userId
              );
            }
          }
        } else {
          setProblemError("Problem not found");
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        setProblemError(error.message || "Failed to fetch problem");
      } finally {
        setIsLoadingProblem(false);
      }
    };


    if (problemId && isInitialized && isLoggedIn && userId) {
      setCurrentProblem(problemId, userId);
      fetchProblem();
    }
  }, [
    problemId,
    isInitialized,
    isLoggedIn,
    userId,
    setCurrentProblem,
    selectedLanguage,
    getCode,
    setCode,
    getProblemById,
  ]);
  const handleCodeChange = useCallback(
    (newCode) => {
      if (userId) {
        setCode(problemId, selectedLanguage, newCode, userId);
      }
      if (error) {
        setError(null);
      }
      if (submissionResult) {
        setSubmissionResult(null);
        setSubmissionError(null);
      }
    },
    [problemId, selectedLanguage, setCode, error, submissionResult, userId]
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
    if (userId) {
      resetCodeForProblem(problemId, selectedLanguage, userId);
    }
    setOutput("");
    setExecutionTime(null);
    setMemoryUsed(null);
    setError(null);
    setTestCaseResults([]);
    setShowInput(false);
    setHasRun(false);
    setCustomInputExecuted(false);
    setSubmissionResult(null);
    setSubmissionError(null);
    clearErrorHighlight();
  };
  const handleCustomInputChange = (newInput) => {
    if (userId) {
      setCustomInput(problemId, newInput, userId);
    }
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
    const validateInput = (code, language) => {
      const inputPatterns = {
        cpp: /cin\s*>>\s*\w+|getline\s*\(|scanf\s*\(/,
        python: /input\s*\(|sys\.stdin|raw_input\s*\(/,
        java: /Scanner|BufferedReader|System\.in/,
        javascript: /readline|process\.stdin/,
      };

      const hasInputHandling = inputPatterns[language]?.test(code);
      const hasTestCaseInput = problem.sampleTestCases.some(
        (tc) => tc.input && tc.input.trim() !== ""
      );
      return { hasInputHandling, hasTestCaseInput };
    };
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
    setSubmissionResult(null);
    setSubmissionError(null);
    setCustomInputExecuted(false);
    clearErrorHighlight();
    clearAllResponses();

    try {
      const results = [];
      let hasError = false;
      let errorInfo = null;

      for (let i = 0; i < problem.sampleTestCases.length; i++) {
        const testCase = problem.sampleTestCases[i];
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}run`, {
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
          if (result.line) {
            highlightError(result.line);
          }
          break;
        }
        const actualOutput = result.output?.trim() || "";
        const expectedOutput = testCase.expectedOutput?.trim() || "";

        if (result.success && result.executionTime) {
          setExecutionTime(result.executionTime);
        }
        if (result.success && result.memory) {
          setMemoryUsed(result.memory);
        }
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

      if (!hasError && customInput.trim()) {
        const customResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}run`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
          if (customResult.executionTime) {
            setExecutionTime(customResult.executionTime);
          }
          if (customResult.memory) {
            setMemoryUsed(customResult.memory);
          }
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

  const handleViewSubmissions = () => {
    setShowHistoryModal(true);
  };

  const handleViewSubmissionCode = (submission) => {
    setSelectedSubmission(submission);
    setShowHistoryModal(false);
    setShowCodeModal(true);
  };

  const handleBackToHistory = () => {
    setShowCodeModal(false);
    setShowHistoryModal(true);
    setSelectedSubmission(null);
  };

  const handleSubmit = async () => {
    if (!problemId || !code.trim()) {
      setSubmissionError("Please write some code before submitting");
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);
    setSubmissionError(null);
    setError(null);
    setAdminFailedTestCase(null);
    clearErrorHighlight();
    clearAllResponses();

    try {
      const allTestCases = await getTestCasesForSubmission(problemId, token);
      const hiddenTestCases = allTestCases.filter(
        (testCase) => !testCase.isPublic
      );

      if (hiddenTestCases.length === 0) {
        setSubmissionError("No hidden test cases found for this problem");
        return;
      }

      let failedCount = 0;
      let firstFailedTestCase = null;
      let firstFailedTestCaseDetails = null;
      let compilationError = null;
      let totalTime = 0;
      let maxMemory = 0;

      for (let i = 0; i < hiddenTestCases.length; i++) {
        const testCase = hiddenTestCases[i];
        const startTime = Date.now();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}run`, {
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
        const endTime = Date.now();
        totalTime += endTime - startTime;

        if (!result.success) {
          compilationError = {
            type: result.type || "runtime",
            message: result.error,
            line: result.line,
          };
          setError(compilationError);
          if (result.line) highlightError(result.line);
          break;
        }

        const actualOutput = result.output?.trim() || "";
        const expectedOutput = testCase.expectedOutput?.trim() || "";

        if (actualOutput !== expectedOutput) {
          failedCount++;
          if (firstFailedTestCase === null) {
            firstFailedTestCase = i + 1;
            firstFailedTestCaseDetails = {
              testCaseNumber: i + 1,
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput: actualOutput,
            };
          }
        }
      }

      const submissionData = {
        problemId,
        code,
        language: selectedLanguage,
        status: compilationError
          ? "Compilation Error"
          : failedCount === 0
          ? "Accepted"
          : "Wrong Answer",
        time: totalTime,
        memory: maxMemory || Math.floor(Math.random() * 50) + 10,
        output: compilationError
          ? compilationError.message
          : failedCount === 0
          ? "All test cases passed"
          : `Failed ${failedCount} test cases`,
      };

      await createSubmission(submissionData, token);
      await getSubmissionsByProblem(problemId, token);

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

        if (user?.role?.includes("admin") && firstFailedTestCaseDetails) {
          setAdminFailedTestCase(firstFailedTestCaseDetails);
        }
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
  useEffect(() => {
    if (problemId && token && isInitialized) {
      getSubmissionsByProblem(problemId, token);
    }
  }, [problemId, token, isInitialized]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        const errorElement = document.getElementById("error-section");
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 200);
    }
  }, [error]);

  useEffect(() => {
    if (submissionError) {
      setTimeout(() => {
        const submissionErrorElement = document.getElementById(
          "submission-error-section"
        );
        if (submissionErrorElement) {
          submissionErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 200);
    }
  }, [submissionError]);

  useEffect(() => {
    if (hasRun && !error && !submissionError) {
      setTimeout(() => {
        if (customInput.trim() && customInputExecuted && output) {
          const customInputElement = document.getElementById(
            "customInput-section"
          );
          if (customInputElement) {
            customInputElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        } else if (testCaseResults.length > 0) {
          const testCasesElement = document.getElementById("testCases-section");
          if (testCasesElement) {
            testCasesElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        }
      }, 200);
    }
  }, [
    hasRun,
    error,
    submissionError,
    customInput,
    customInputExecuted,
    output,
    testCaseResults,
  ]);

  useEffect(() => {
    const hasAnyResponse = Object.values(responses).some((response) => {
      return (
        response &&
        response !== "" &&
        response !== null &&
        response !== undefined
      );
    });

    if (hasAnyResponse) {
      setTimeout(() => {
        const aiResponsesElement = document.getElementById("ai-responses");
        if (aiResponsesElement) {
          aiResponsesElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 500);
    }
  }, [responses]);
  useEffect(() => {
    if (problemId) {
      clearAllResponses();
    }
  }, [problemId, clearAllResponses]);

  if (problemError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-medium">
            {problemError}
          </div>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Problem not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4 max-w-full">
        <HeroSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          <div className="lg:col-span-1">
            <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-hidden">
              <ProblemSection problem={problem} />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="sticky z-20 top-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pb-2">
              <ActionButtons
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                onRunCode={runCode}
                onSubmit={handleSubmit}
              />
            </div>

            <div className="relative z-10">
              <CodeEditor
                selectedLanguage={selectedLanguage}
                languages={languages}
                code={code}
                error={error}
                isCopied={isCopied}
                editorRef={editorRef}
                onLanguageChange={handleLanguageChange}
                onCopyCode={copyCode}
                onDownloadCode={downloadCode}
                onResetCode={resetCode}
                submissions={submissions}
                onViewSubmissions={handleViewSubmissions}
              />
              <SubmissionHistoryModal
                isOpen={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                submissions={submissions}
                onViewCode={handleViewSubmissionCode}
                isLoading={submissionLoading}
              />

              <SubmissionCodeModal
                isOpen={showCodeModal}
                onClose={() => setShowCodeModal(false)}
                submission={selectedSubmission}
                onBack={handleBackToHistory}
              />
            </div>

            <div className="relative">
              <AIResponseDisplay />
            </div>

            {submissionResult && (
              <div
                id="submission-result"
                className="bg-white dark:bg-slate-800 rounded-lg border shadow-sm p-6"
              >
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

                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {submissionResult.status === "accepted"
                    ? `🎉 Congratulations !! Your solution is correct`
                    : submissionResult.failedTestCase !== undefined &&
                      "Failed on a hidden test case"}
                </p>

                <div className="mt-3 text-sm font-semibold text-gray-500 dark:text-white">
                  {submissionResult.status === "accepted"
                    ? `Happy Coding 😊. Attack more problems !!`
                    : `${
                        submissionResult.totalTestCases -
                        submissionResult.failedCount
                      }/${submissionResult.totalTestCases} testcases passed`}
                </div>

                {user?.role?.includes("admin") && adminFailedTestCase && (
                  <div className="mt-4 p-4 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-3">
                      🔒 Admin Debug Info - Failed Test Case{" "}
                      {adminFailedTestCase.testCaseNumber}:
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Input:
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded p-2">
                          <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap break-all overflow-visible">
                            {adminFailedTestCase.input}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Expected Output:
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded p-2">
                          <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap break-all overflow-visible">
                            {adminFailedTestCase.expectedOutput}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Your Output:
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
                          <pre className="text-xs text-red-700 dark:text-red-300 font-mono whitespace-pre-wrap break-all overflow-visible">
                            {adminFailedTestCase.actualOutput || "No output"}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {submissionError && (
              <div
                id="submission-error-section"
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h4 className="font-medium">Submission Error</h4>
                </div>
                <p className="mt-1 text-red-700 dark:text-red-300 text-sm">
                  {submissionError}
                </p>
              </div>
            )}

            {error && (
              <div id="error-section">
                <ErrorDisplay
                  error={error}
                  output={output}
                  language={selectedLanguage}
                />
              </div>
            )}

            {!error &&
              !submissionResult &&
              problem.sampleTestCases &&
              problem.sampleTestCases.length > 0 && (
                <div id="testCases-section">
                  <TestCasesSection
                    testCases={problem.sampleTestCases.slice(0, 3)}
                    testCaseResults={testCaseResults}
                    executionTime={executionTime}
                    memoryUsed={memoryUsed}
                    isRunning={isRunning}
                  />
                </div>
              )}

            {!error && !submissionResult && (
              <div id="customInput-section">
                <CustomInput
                  customInput={customInput}
                  showInput={showInput}
                  onInputChange={handleCustomInputChange}
                  onToggleInput={() => setShowInput(!showInput)}
                />
              </div>
            )}

            {!error &&
              !submissionResult &&
              customInput.trim() &&
              customInputExecuted &&
              hasRun && (
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
      <FloatingAIAssistant
        problem={problem}
        code={code}
        selectedLanguage={selectedLanguage}
        error={error}
        testCaseResults={testCaseResults}
        submissionResult={submissionResult}
      />
    </div>
  );
};

export default ProblemPage;
