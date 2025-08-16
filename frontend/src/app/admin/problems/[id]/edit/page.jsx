"use client";
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useProblemEdit } from "@/hooks/editProblemPageHooks/useProblemEdit";
import { useTestCases } from "@/hooks/editProblemPageHooks/useTestcase";
import { useTags } from "@/hooks/editProblemPageHooks/useTags";
import { useUI } from "@/hooks/editProblemPageHooks/useUI";
import { ErrorDisplay } from "@/components/ProblemEditPageComponents/ErrorDisplay";
import { Header } from "@/components/ProblemEditPageComponents/Header";
import { TabNavigation } from "@/components/ProblemEditPageComponents/TabNavigation";
import { BasicInfoTab } from "@/components/ProblemEditPageComponents/BasicInfoTab";
import { DescriptionTab } from "@/components/ProblemEditPageComponents/DescriptionTab";
import { FormatTab } from "@/components/ProblemEditPageComponents/FormatTab";
import { TestCasesTab } from "@/components/ProblemEditPageComponents/TestCasesTab";



const renderMarkdownPreview = (text) => {
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
        } else if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-semibold mb-2">
              {line.slice(2, -2)}
            </p>
          );
        } else if (line.trim() === "") {
          return <br key={i} />;
        } else {
          return (
            <p key={i} className="mb-2 leading-relaxed">
              {line}
            </p>
          );
        }
      })}
    </div>
  );
};

export default function ProblemEditPage() {
  const {
    problemData,
    setProblemData,
    isLoading,
    isSaving,
    error,
    hasChanges,
    handleInputChange,
    handleSubmit,
    handleGoBack,
    fetchProblemData,
  } = useProblemEdit();

  const { handleTestCaseChange, addTestCase, removeTestCase } = useTestCases(
    problemData,
    setProblemData
  );

  // Tags hook
  const { currentTag, setCurrentTag, addTag, removeTag } = useTags(
    problemData,
    setProblemData
  );

  // UI state hook
  const { previewMode, setPreviewMode, activeTab, setActiveTab } = useUI();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading problem data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={fetchProblemData}
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Header hasChanges={hasChanges} onGoBack={handleGoBack} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabNavigation />

          <TabsContent value="basic" className="space-y-6">
            <BasicInfoTab
              problemData={problemData}
              onInputChange={handleInputChange}
              currentTag={currentTag}
              setCurrentTag={setCurrentTag}
              addTag={addTag}
              removeTag={removeTag}
            />
          </TabsContent>

          <TabsContent value="description" className="space-y-6">
            <DescriptionTab
              problemData={problemData}
              onInputChange={handleInputChange}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              renderMarkdownPreview={renderMarkdownPreview}
            />
          </TabsContent>

          <TabsContent value="format" className="space-y-6">
            <FormatTab
              problemData={problemData}
              onInputChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="testcases" className="space-y-6">
            <TestCasesTab
              problemData={problemData}
              handleTestCaseChange={handleTestCaseChange}
              addTestCase={addTestCase}
              removeTestCase={removeTestCase}
              hasChanges={hasChanges}
              isSaving={isSaving}
              onSubmit={handleSubmit}
              onGoBack={handleGoBack}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}