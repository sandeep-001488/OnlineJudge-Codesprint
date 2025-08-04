"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const ProblemSection = ({ problem }) => {

  const renderMarkdownPreview = (text) => {
    if (!text)
      return (
        <p className="text-muted-foreground italic">No content provided...</p>
      );

    return (
      <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100">
        {text.split("\n").map((line, i) => {
          if (line.startsWith("# ")) {
            return (
              <h1
                key={i}
                className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100"
              >
                {line.slice(2)}
              </h1>
            );
          } else if (line.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200"
              >
                {line.slice(3)}
              </h2>
            );
          } else if (line.startsWith("### ")) {
            return (
              <h3
                key={i}
                className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200"
              >
                {line.slice(4)}
              </h3>
            );
          } else if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={i} className="font-semibold mb-2">
                {line.slice(2, -2)}
              </p>
            );
          } else if (line.includes("**")) {
            // Handle inline bold text
            const parts = line.split("**");
            return (
              <p key={i} className="mb-2 leading-relaxed">
                {parts.map((part, idx) =>
                  idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                )}
              </p>
            );
          } else if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <li key={i} className="mb-1 ml-4 list-disc">
                {line.slice(2)}
              </li>
            );
          } else if (line.trim() === "") {
            return <br key={i} />;
          } else {
            return (
              <p
                key={i}
                className="mb-2 leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {line}
              </p>
            );
          }
        })}
      </div>
    );
  };

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
        {/* Problem Description - NOW WITH MARKDOWN RENDERING */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Problem Description
          </h3>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {renderMarkdownPreview(problem.description)}
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-slate-700" />

        {/* Input Format - NOW WITH MARKDOWN RENDERING */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            📥 Input Format
          </h3>
          <div className="bg-gray-50 dark:bg-slate-950 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {renderMarkdownPreview(problem.inputFormat)}
            </div>
          </div>
        </div>

        {/* Output Format - NOW WITH MARKDOWN RENDERING */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            📤 Output Format
          </h3>
          <div className="bg-gray-50 dark:bg-slate-950 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {renderMarkdownPreview(problem.outputFormat)}
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-slate-700" />

        {/* Constraints - NOW WITH MARKDOWN RENDERING */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            ⚠️ Constraints
          </h3>
          <div className="bg-yellow-50 dark:bg-yellow-500/5 rounded-lg p-4 border border-yellow-200 dark:border-yellow-500/20">
            <div className="text-sm text-yellow-800 dark:text-yellow-300">
              {renderMarkdownPreview(problem.constraints)}
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-slate-700" />

        {/* Sample Test Cases - EXPLANATION NOW WITH MARKDOWN RENDERING */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            🧪 Sample Test Cases
          </h3>
          {problem.sampleTestCases
            ?.slice()
            .reverse()
            .map((testCase, index) => (
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
                      <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {renderMarkdownPreview(testCase.explanation)}
                      </div>
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
