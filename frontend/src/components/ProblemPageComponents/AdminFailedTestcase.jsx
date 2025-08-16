import React from "react";

export const AdminFailedTestCase = ({ testCase }) => (
  <div className="mt-4 p-4 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
    <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-3">
      🔒 Admin Debug Info - Failed Test Case {testCase.testCaseNumber}:
    </h4>
    <div className="space-y-3">
      <TestCaseDetail label="Input:" content={testCase.input} />
      <TestCaseDetail
        label="Expected Output:"
        content={testCase.expectedOutput}
      />
      <TestCaseDetail
        label="Your Output:"
        content={testCase.actualOutput || "No output"}
        isError
      />
    </div>
  </div>
);
