import React from "react";

export const SubmissionErrorDisplay = ({ submissionError }) => (
  <div
    id="submission-error-section"
    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
  >
    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      <h4 className="font-medium">Submission Error</h4>
    </div>
    <p className="mt-1 text-red-700 dark:text-red-300 text-sm">
      {submissionError}
    </p>
  </div>
);
