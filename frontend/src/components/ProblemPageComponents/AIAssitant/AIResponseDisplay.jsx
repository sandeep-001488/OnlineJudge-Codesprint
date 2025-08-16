"use client";
import React from "react";
import { useAIStore } from "@/store/aiStore";
import {
  Sparkles,
  Bug,
  Lightbulb,
  Zap,
  TestTube,
  X,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

const AIResponseDisplay = () => {
  const { responses, clearResponse, isLoading } = useAIStore();
  const [copiedStates, setCopiedStates] = useState({});

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const responseTypes = [
    {
      key: "errorExplanation",
      title: "Error Explanation",
      icon: Bug,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      key: "hint",
      title: "AI Hint",
      icon: Lightbulb,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      key: "optimization",
      title: "Optimization Suggestions",
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      key: "testCaseExplanation",
      title: "Test Case Explanation",
      icon: TestTube,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
  ];

  const getMostRecentResponse = () => {
    const responsesWithTimestamp = responseTypes
      .filter((type) => {
        const response = responses[type.key];
        return response && response.trim() !== "";
      })
      .map((type) => ({
        ...type,
        timestamp: responses[`${type.key}_timestamp`] || 0,
      }));

    return responsesWithTimestamp.length > 0
      ? [responsesWithTimestamp.sort((a, b) => b.timestamp - a.timestamp)[0]]
      : [];
  };

  const activeResponses = getMostRecentResponse();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border shadow-sm p-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              AI is analyzing your code...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (activeResponses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 px-2 sm:px-0" id="ai-responses">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          AI Assistant Responses
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent dark:from-purple-800"></div>
      </div>

      {activeResponses.map((responseType) => {
        const Icon = responseType.icon;
        const response = responses[responseType.key];
        const isCopied = copiedStates[responseType.key];

        return (
          <div
            key={responseType.key}
            className={`rounded-lg border-2 overflow-hidden ${responseType.bgColor} ${responseType.borderColor} animate-in slide-in-from-right duration-300`}
          >
            <div className="px-4 py-3 border-b border-current/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className={`w-5 h-5 ${responseType.color}`} />
                <h3 className={`font-semibold ${responseType.color}`}>
                  {responseType.title}
                </h3>
                <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-medium">AI</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(response, responseType.key)}
                  className={`p-1.5 rounded-lg transition-colors ${responseType.color} hover:bg-current/10`}
                  title="Copy response"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => clearResponse(responseType.key)}
                  className={`p-1.5 rounded-lg transition-colors ${responseType.color} hover:bg-current/10`}
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {typeof response === "string" ? (
                  <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base break-words">
                    {response}
                  </div>
                ) : Array.isArray(response) ? (
                  <div className="space-y-3 sm:max-w-full">
                    {response.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg"
                      >
                        {typeof item === "string" ? (
                          <div className="text-slate-700 dark:text-slate-300">
                            {item}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {item.title && (
                              <h4 className="font-medium text-slate-800 dark:text-slate-200">
                                {item.title}
                              </h4>
                            )}
                            {item.description && (
                              <p className="text-slate-600 dark:text-slate-400">
                                {item.description}
                              </p>
                            )}
                            {item.code && (
                              <pre className="bg-slate-800 text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
                                <code>{item.code}</code>
                              </pre>
                            )}
                            {item.explanation && (
                              <p className="text-slate-700 dark:text-slate-300">
                                {item.explanation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : response && typeof response === "object" ? (
                  <div className="space-y-3">
                    {response.explanation && (
                      <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {response.explanation}
                      </div>
                    )}
                    {response.suggestions && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">
                          Suggestions:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {Array.isArray(response.suggestions) ? (
                            response.suggestions.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))
                          ) : (
                            <li>{response.suggestions}</li>
                          )}
                        </ul>
                      </div>
                    )}
                    {response.code && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">
                          Code Example:
                        </h4>
                        <pre className="bg-slate-800 text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
                          <code>{response.code}</code>
                        </pre>
                      </div>
                    )}
                    {response.steps && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">
                          Steps to Fix:
                        </h4>
                        <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
                          {Array.isArray(response.steps) ? (
                            response.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))
                          ) : (
                            <li>{response.steps}</li>
                          )}
                        </ol>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">
                        Unexpected response format
                      </span>
                    </div>
                    <pre className="mt-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-current/20">
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {responseType.key === "hint" &&
                      "💡 Use this hint to guide your thinking, but try to implement the solution yourself!"}
                    {responseType.key === "errorExplanation" &&
                      "🔧 Apply the suggested fixes and test your code again."}
                    {responseType.key === "optimization" &&
                      "⚡ Consider these optimizations to improve your solution's performance."}
                    {responseType.key === "testCaseExplanation" &&
                      "🧪 Understanding test cases helps you debug and improve your logic."}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AIResponseDisplay;
