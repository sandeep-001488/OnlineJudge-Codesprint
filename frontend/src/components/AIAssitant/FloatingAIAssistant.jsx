"use client";
import React, { useState, useEffect } from "react";
import { useAIStore } from "@/store/aiStore";
import { useAuthStore } from "@/store/authStore";
import {
  Sparkles,
  Bug,
  Lightbulb,
  Zap,
  TestTube,
  Clock,
  AlertCircle,
  ChevronDown,
  EyeOff,
} from "lucide-react";

const FloatingAIAssistant = ({
  problem,
  code,
  selectedLanguage,
  error,
  testCaseResults,
  submissionResult,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    isLoading,
    error: aiError,
    getRemainingCalls,
    getTimeUntilReset,
    explainError,
    getHint,
    explainVisibleTestCase,
    explainHiddenFailure,
    suggestOptimizations,
    responses,
    clearError,
  } = useAIStore();

  const { token } = useAuthStore();

  const remainingCalls = getRemainingCalls();
  const timeUntilReset = getTimeUntilReset();

  useEffect(() => {
    if (error && !responses.errorExplanation) {
      setIsExpanded(true);
    }
  }, [error, responses.errorExplanation]);

  const getAvailableActions = () => {
    const actions = [];

    if (error) {
      actions.push({
        id: "debug",
        icon: Bug,
        title: "Debug Error",
        description: "Get AI help to understand and fix this error",
        color: "text-red-500",
        bgColor: "bg-red-50 hover:bg-red-100",
        borderColor: "border-red-200",
      });
      return actions;
    }

    actions.push(
      {
        id: "hint",
        icon: Lightbulb,
        title: "Get Hint",
        description: "Get a helpful hint for this problem",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50 hover:bg-yellow-100",
        borderColor: "border-yellow-200",
      },
      {
        id: "optimize",
        icon: Zap,
        title: "Optimize Code",
        description: "Get suggestions to improve your solution",
        color: "text-purple-500",
        bgColor: "bg-purple-50 hover:bg-purple-100",
        borderColor: "border-purple-200",
      }
    );

    if (testCaseResults && testCaseResults.some((tc) => !tc.passed)) {
      actions.push({
        id: "explain-testcase",
        icon: TestTube,
        title: "Explain Test Case",
        description: "Understand why a visible test case failed",
        color: "text-blue-500",
        bgColor: "bg-blue-50 hover:bg-blue-100",
        borderColor: "border-blue-200",
      });
    }

    if (
      submissionResult &&
      !submissionResult.success &&
      submissionResult.hiddenTestsFailed
    ) {
      actions.push({
        id: "explain-hidden",
        icon: EyeOff,
        title: "Debug Hidden Tests",
        description: "Get help with hidden test case failures",
        color: "text-indigo-500",
        bgColor: "bg-indigo-50 hover:bg-indigo-100",
        borderColor: "border-indigo-200",
      });
    }

    return actions;
  };

  const handleActionClick = async (action) => {
    if (remainingCalls <= 0) {
      alert(
        `Rate limit exceeded. Please wait ${Math.ceil(
          timeUntilReset / 60000
        )} minutes.`
      );
      return;
    }

    try {
      clearError();

      switch (action.id) {
        case "debug":
          if (error) {
            await explainError(
              code,
              error.message || error,
              selectedLanguage,
              token
            );
          }
          break;

        case "hint":
          await getHint({
            title: problem.title,
            description: problem.description,
            language: selectedLanguage,
            tags: problem.tags,
            token,
          });
          break;

        case "optimize":
          await suggestOptimizations(
            code,
            selectedLanguage,
            problem.title,
            problem.description,
            token
          );
          break;

        case "explain-testcase":
          const failedTestCase = testCaseResults?.find((tc) => !tc.passed);
          if (failedTestCase) {
            await explainVisibleTestCase(
              code,
              selectedLanguage,
              failedTestCase.input,
              failedTestCase.expectedOutput,
              failedTestCase.actualOutput,
              token
            );
          }
          break;

        case "explain-hidden":
          await explainHiddenFailure(
            code,
            selectedLanguage,
            problem.title,
            problem.description,
            token
          );
          break;
      }

      setIsExpanded(false);
    } catch (error) {
      console.error("AI action failed:", error);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.ceil(ms / 60000);
    return `${minutes}m`;
  };

  const availableActions = getAvailableActions();

  if (!problem || availableActions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div
          className={`transition-all duration-300 ${
            isExpanded ? "w-65 md:w-80" : "w-14"
          }`}
        >
          {isExpanded && (
            <div className="mb-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-semibold">AI Assistant</h3>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 text-xs opacity-90 flex items-center space-x-4">
                  <span>{remainingCalls}/5 calls left</span>
                  {remainingCalls === 0 && (
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Resets in {formatTime(timeUntilReset)}</span>
                    </span>
                  )}
                </div>
              </div>

              {error && !responses.errorExplanation && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Error detected — want AI to help debug it?</span>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-sm">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              )}

              {aiError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{aiError}</span>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-3">
                {availableActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      disabled={remainingCalls <= 0 || isLoading}
                      className={`w-full p-3 rounded-xl border-2 transition-all ${
                        action.bgColor
                      } ${action.borderColor} ${
                        remainingCalls <= 0 || isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-[1.02]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${action.color}`} />
                        <div className="text-left">
                          <div className="font-medium text-slate-800 ">
                            {action.title}
                          </div>
                          <div className="text-xs text-slate-600 ">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 relative"
          >
            <Sparkles className="w-6 h-6" />

            {error && !responses.errorExplanation && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}

            {remainingCalls <= 2 && remainingCalls > 0 && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {remainingCalls}
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default FloatingAIAssistant;
