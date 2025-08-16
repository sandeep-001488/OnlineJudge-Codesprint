"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";

import { HeroSection } from "@/components/ProblemPageComponents/CompilerHeroSection";
import { ProblemSection } from "@/components/ProblemPageComponents/ProblemSection";
import { CodeEditor } from "@/components/ProblemPageComponents/CodeEditor";
import { TestCasesSection } from "@/components/ProblemPageComponents/TestCasesSection";
import { CustomInput } from "@/components/ProblemPageComponents/CustomInput";
import { ActionButtons } from "@/components/ProblemPageComponents/ActionButtons";
import { OutputPanel } from "@/components/ProblemPageComponents/OutputPanel";
import { ErrorDisplay } from "@/components/ProblemPageComponents/ErrorDisplay";
import { SubmissionHistoryModal } from "@/components/ProblemPageComponents/SubmissionHistoryModel";
import { SubmissionCodeModal } from "@/components/ProblemPageComponents/SubmissionCodeModel";
import FloatingAIAssistant from "@/components/ProblemPageComponents/AIAssitant/FloatingAIAssistant";
import AIResponseDisplay from "@/components/ProblemPageComponents/AIAssitant/AIResponseDisplay";
import { SubmissionResultDisplay } from "@/components/ProblemPageComponents/SubmissionResultDisplay";
import { SubmissionErrorDisplay } from "@/components/ProblemPageComponents/SubmissionErrorDisplay";
import { useCodeExecution } from "@/hooks/problemPageHooks/useCodeExecutionHook";
import { useSubmission } from "@/hooks/problemPageHooks/useSubmissionHook";
import { useUIState } from "@/hooks/problemPageHooks/useUIState";
import { useScrollToSection } from "@/hooks/problemPageHooks/useScrollToSection";
import { useProblemData } from "@/hooks/problemPageHooks/useProblemData";

const LANGUAGES = [
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
    template: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your solution here\n    }\n}`,
  },
  {
    value: "javascript",
    label: "JavaScript",
    version: "Node.js 18",
    template: `const readline = require('readline');\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\n// Your solution here`,
  },
];

const ProblemPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const problemId = slug?.split("-").pop();

  const { problem, problemError } = useProblemData(problemId);

  const {
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
    handleCustomInputChange,
    runCode,
    copyCode,
    downloadCode,
    resetCode,
  } = useCodeExecution(problemId, problem);

  const {
    isSubmitting,
    submissionResult,
    submissionError,
    adminFailedTestCase,
    submissions,
    submissionLoading,
    showHistoryModal,
    setShowHistoryModal,
    showCodeModal,
    setShowCodeModal,
    selectedSubmission,
    handleSubmit,
    handleViewSubmissions,
    handleViewSubmissionCode,
    handleBackToHistory,
  } = useSubmission(problemId, code, selectedLanguage);

  const { showInput, setShowInput } = useUIState();

  useScrollToSection({
    error,
    submissionError,
    hasRun,
    customInput,
    customInputExecuted,
    output,
    testCaseResults,
  });

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                languages={LANGUAGES}
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
              <SubmissionResultDisplay
                submissionResult={submissionResult}
                adminFailedTestCase={adminFailedTestCase}
              />
            )}

            {submissionError && (
              <SubmissionErrorDisplay submissionError={submissionError} />
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
