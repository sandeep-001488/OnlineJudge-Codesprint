"use client";
import {
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getResultIcon = (passed, error) => {
  if (error) return <AlertCircle className="w-4 h-4 text-orange-500" />;
  if (passed) return <CheckCircle className="w-4 h-4 text-green-500" />;
  return <XCircle className="w-4 h-4 text-red-500" />;
};

const getResultBadgeColor = (passed, error) => {
  if (error)
    return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20";
  if (passed)
    return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
  return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
};

export const TestCasesSection = ({
  testCases,
  testCaseResults = [],
  executionTime,
  isRunning,
}) => {
  const passedCount = testCaseResults.filter(
    (result) => result.passed && !result.error
  ).length;
  const totalCount = testCaseResults.length;

  return (
    <Card className="pb-1 bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className=" border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
              <TestTube className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-gray-900 dark:text-white font-semibold">
              Test Cases
            </CardTitle>
            {testCaseResults.length > 0 && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  passedCount === totalCount
                    ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                    : "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                }`}
              >
                {passedCount}/{totalCount} Passed
              </Badge>
            )}
          </div>

          {/* Execution Time Badge */}
          {executionTime && !isRunning && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              {executionTime}ms
            </Badge>
          )}

          {isRunning && (
            <Badge
              variant="outline"
              className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20 animate-pulse"
            >
              Running...
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 max-h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {testCases.map((testCase, index) => {
            const result = testCaseResults.find(
              (r) => r.testCase === index + 1
            );

            return (
              <div
                key={index}
                className={`border rounded-lg p-4 transition-all ${
                  result
                    ? result.passed && !result.error
                      ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20"
                      : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Test Case {index + 1}
                    </span>
                    {result && (
                      <Badge
                        variant="outline"
                        className={`text-xs flex items-center gap-1 ${getResultBadgeColor(
                          result.passed,
                          result.error
                        )}`}
                      >
                        {getResultIcon(result.passed, result.error)}
                        {result.error
                          ? "Error"
                          : result.passed
                          ? "Passed"
                          : "Failed"}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Input:
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded p-2">
                      <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                        {testCase.input}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Expected Output:
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded p-2">
                      <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                  </div>

                  {result && result.actualOutput && (
                    <div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Your Output:
                      </div>
                      <div
                        className={`border rounded p-2 ${
                          result.passed && !result.error
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        }`}
                      >
                        <pre
                          className={`text-xs font-mono whitespace-pre-wrap ${
                            result.passed && !result.error
                              ? "text-green-700 dark:text-green-300"
                              : "text-red-700 dark:text-red-300"
                          }`}
                        >
                          {result.actualOutput}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};