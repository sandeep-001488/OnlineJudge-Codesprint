"use client";
import { XCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const getErrorIcon = (errorType) => {
  switch (errorType) {
    case "compilation":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "runtime":
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case "network":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-red-500" />;
  }
};

const getErrorTitle = (errorType) => {
  switch (errorType) {
    case "compilation":
      return "Compilation Error";
    case "runtime":
      return "Runtime Error";
    case "input_validation":
      return "Input Validation Warning";
    case "network":
      return "Network Error";
    default:
      return "Error";
  }
};

const getErrorColor = (errorType) => {
  switch (errorType) {
    case "compilation":
      return {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-600 dark:text-red-400",
      };
    case "runtime":
      return {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        border: "border-orange-200 dark:border-orange-800",
        text: "text-orange-600 dark:text-orange-400",
      };
    case "input_validation":
      return {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-600 dark:text-yellow-400",
      };
    case "network":
      return {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-600 dark:text-red-400",
      };
    default:
      return {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-600 dark:text-red-400",
      };
  }
};

export const ErrorDisplay = ({ error, output,language }) => {
  const errorColors = getErrorColor(error.type);

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${errorColors.bg} ${errorColors.border} border`}
          >
            {getErrorIcon(error.type)}
          </div>
          <CardTitle className={`text-lg font-semibold ${errorColors.text}`}>
            {getErrorTitle(error.type)}
            {error &&
              error.line !== null &&
              !(language === "cpp" && error.type === "runtime") &&
              ` (Line ${error.line})`}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div
          className={`p-4 rounded-lg border ${errorColors.bg} ${errorColors.border}`}
        >
          {error.message && (
            <div className={`mb-4 ${errorColors.text}`}>
              <div className="font-semibold mb-2">Error Details:</div>
              <pre className="text-sm font-mono whitespace-pre-wrap bg-gray-900 text-gray-100 p-3 rounded border overflow-x-auto">
                {error.message}
              </pre>
            </div>
          )}

          {output && output !== error.message && (
            <div
              className={`rounded p-3 ${errorColors.bg} border ${errorColors.border}`}
            >
              <div className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Raw Output:
              </div>
              <pre
                className={`text-sm font-mono whitespace-pre-wrap ${errorColors.text}`}
              >
                {output}
              </pre>
            </div>
          )}
        </div>

        {/* Help text based on error type */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>💡 Tip:</strong>{" "}
            {error.type === "compilation" && (
              <>Check line {error.line || "highlighted"} for syntax errors.</>
            )}
            {error.type === "runtime" && (
              <>
                {language === "cpp" ? (
                  <>Check for invalid memory access </>
                ) : (
                  <>
                    Check line {error.line || "highlighted"} for runtime issues.
                  </>
                )}
              </>
            )}
            {error.type === "network" &&
              "Check your internet connection and try running the code again."}
            {error.type === "unknown" &&
              "Review your code logic and check for any potential issues."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
