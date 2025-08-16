import React from "react";
import { useAuthStore } from "@/store/authStore";

export const SubmissionResultDisplay = ({
  submissionResult,
  adminFailedTestCase,
}) => {
  const { user } = useAuthStore();

  return (
    <div
      id="submission-result"
      className="bg-white dark:bg-slate-800 rounded-lg border shadow-sm p-6"
    >
      <div
        className={`flex items-center space-x-3 ${
          submissionResult.status === "accepted"
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full ${
            submissionResult.status === "accepted"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        ></div>
        <h3 className="text-lg font-semibold">
          {submissionResult.status === "accepted" ? "Accepted" : "Wrong Answer"}
        </h3>
      </div>

      <p className="mt-2 text-gray-700 dark:text-gray-300">
        {submissionResult.status === "accepted"
          ? `🎉 Congratulations !! Your solution is correct`
          : submissionResult.failedTestCase !== undefined &&
            "Failed on a hidden test case"}
      </p>

      <div className="mt-3 text-sm font-semibold text-gray-500 dark:text-white">
        {submissionResult.status === "accepted"
          ? `Happy Coding 😊. Attack more problems !!`
          : `${
              submissionResult.totalTestCases - submissionResult.failedCount
            }/${submissionResult.totalTestCases} testcases passed`}
      </div>

      {user?.role?.includes("admin") && adminFailedTestCase && (
        <AdminFailedTestCase testCase={adminFailedTestCase} />
      )}
    </div>
  );
};
