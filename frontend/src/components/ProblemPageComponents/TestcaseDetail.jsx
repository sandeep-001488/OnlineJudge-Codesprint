import React from "react";

export const TestCaseDetail = ({ label, content, isError = false }) => (
  <div>
    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </div>
    <div
      className={`border rounded p-2 ${
        isError
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-600"
      }`}
    >
      <pre
        className={`text-xs font-mono whitespace-pre-wrap break-all overflow-visible ${
          isError
            ? "text-red-700 dark:text-red-300"
            : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {content}
      </pre>
    </div>
  </div>
);
