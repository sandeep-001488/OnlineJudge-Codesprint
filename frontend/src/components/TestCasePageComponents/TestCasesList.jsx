"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TestTube } from "lucide-react";
import TestCaseCard from "./TestCaseCard";

const TestCasesList = ({
  testCaseLoading,
  filteredTestCases,
  testCases,
  filterType,
  editingTestCase,
  formData,
  setFormData,
  onStartEditing,
  onCancelEditing,
  onUpdateSubmit,
  onDelete,
  onCreateClick,
  isLoading,
}) => {
  if (testCaseLoading && testCases.length === 0) {
    return (
      <Card className="text-center py-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading test cases...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredTestCases.length === 0) {
    return (
      <Card className="text-center py-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <TestTube className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No test cases found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filterType === "all"
                  ? "No test cases have been created yet."
                  : filterType === "public"
                  ? "No public test cases available."
                  : "No private test cases available."}
              </p>
              <Button
                onClick={onCreateClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Test Case
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredTestCases.map((testCase, index) => (
        <TestCaseCard
          key={testCase._id}
          testCase={testCase}
          index={index}
          isEditing={editingTestCase?._id === testCase._id}
          formData={formData}
          setFormData={setFormData}
          onStartEditing={onStartEditing}
          onCancelEditing={onCancelEditing}
          onUpdateSubmit={onUpdateSubmit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default TestCasesList;
