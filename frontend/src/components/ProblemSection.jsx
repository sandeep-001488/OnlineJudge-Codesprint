"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const ProblemSection = ({ problem }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20";
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl h-full top-50">
      {/* Fixed Header - This stays at the top */}
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800  top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl  rounded-t-lg">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📚</span>
            </div>
            {problem.title}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`text-xs font-semibold px-3 py-1 ${getDifficultyColor(
                problem.difficulty
              )}`}
            >
              {problem.difficulty?.toUpperCase()}
            </Badge>
            {problem.tags?.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      {/* Scrollable Content - This scrolls independently */}
      <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Problem Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Problem Description
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {problem.description}
          </p>
        </div>

        <Separator className="bg-gray-200 dark:bg-slate-700" />

        {/* Input Format */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            📥 Input Format
          </h3>
          <div className="bg-gray-50 dark:bg-slate-950 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
              {problem.inputFormat}
            </pre>
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            📤 Output Format
          </h3>
          <div className="bg-gray-50 dark:bg-slate-950 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
              {problem.outputFormat}
            </pre>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-slate-700" />

        {/* Constraints */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            ⚠️ Constraints
          </h3>
          <div className="bg-yellow-50 dark:bg-yellow-500/5 rounded-lg p-4 border border-yellow-200 dark:border-yellow-500/20">
            <pre className="text-sm text-yellow-800 dark:text-yellow-300 whitespace-pre-wrap font-mono">
              {problem.constraints}
            </pre>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-slate-700" />

        {/* Sample Test Cases */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            🧪 Sample Test Cases
          </h3>
          {problem.sampleTestCases?.map((testCase, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 border border-blue-200 dark:border-slate-600"
            >
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3">
                Example {index + 1}:
              </h4>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Input:
                  </span>
                  <div className="bg-white dark:bg-slate-900 rounded p-3 mt-1 border border-gray-200 dark:border-slate-600">
                    <pre className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {testCase.input}
                    </pre>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Output:
                  </span>
                  <div className="bg-white dark:bg-slate-900 rounded p-3 mt-1 border border-gray-200 dark:border-slate-600">
                    <pre className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                </div>

                {testCase.explanation && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Explanation:
                    </span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {testCase.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};