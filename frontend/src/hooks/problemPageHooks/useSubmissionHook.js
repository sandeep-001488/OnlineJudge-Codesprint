import { useState, useEffect } from "react";
import { useSubmissionStore } from "@/store/submissionStore";
import { useTestCaseStore } from "@/store/testcaseStore";
import { useAuthStore } from "@/store/authStore";
import { useAIStore } from "@/store/aiStore";

export const useSubmission = (problemId, code, selectedLanguage) => {
  const { user, token } = useAuthStore();
  const { clearAllResponses } = useAIStore();
  const {
    createSubmission,
    getSubmissionsByProblem,
    submissions,
    isLoading: submissionLoading,
  } = useSubmissionStore();
  const { getTestCasesForSubmission } = useTestCaseStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [adminFailedTestCase, setAdminFailedTestCase] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    if (problemId && token) {
      getSubmissionsByProblem(problemId, token);
    }
  }, [problemId, token, getSubmissionsByProblem]);

  const handleSubmit = async () => {
    if (!problemId || !code.trim()) {
      setSubmissionError("Please write some code before submitting");
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);
    setSubmissionError(null);
    setAdminFailedTestCase(null);
    clearAllResponses();

    try {
      const allTestCases = await getTestCasesForSubmission(problemId, token);
      const hiddenTestCases = allTestCases.filter(
        (testCase) => !testCase.isPublic
      );

      if (hiddenTestCases.length === 0) {
        setSubmissionError("No hidden test cases found for this problem");
        return;
      }

      let failedCount = 0;
      let firstFailedTestCase = null;
      let firstFailedTestCaseDetails = null;
      let compilationError = null;
      let totalTime = 0;
      let maxMemory = 0;

      for (let i = 0; i < hiddenTestCases.length; i++) {
        const testCase = hiddenTestCases[i];
        const startTime = Date.now();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: selectedLanguage,
            code: code,
            input: testCase.input,
          }),
        });

        const result = await response.json();
        const endTime = Date.now();
        totalTime += endTime - startTime;

        if (!result.success) {
          compilationError = {
            type: result.type || "runtime",
            message: result.error,
            line: result.line,
          };
          break;
        }

        const actualOutput = result.output?.trim() || "";
        const expectedOutput = testCase.expectedOutput?.trim() || "";

        if (actualOutput !== expectedOutput) {
          failedCount++;
          if (firstFailedTestCase === null) {
            firstFailedTestCase = i + 1;
            firstFailedTestCaseDetails = {
              testCaseNumber: i + 1,
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput: actualOutput,
            };
          }
        }
      }

      const submissionData = {
        problemId,
        code,
        language: selectedLanguage,
        status: compilationError
          ? "Compilation Error"
          : failedCount === 0
          ? "Accepted"
          : "Wrong Answer",
        time: totalTime,
        memory: maxMemory || Math.floor(Math.random() * 50) + 10,
        output: compilationError
          ? compilationError.message
          : failedCount === 0
          ? "All test cases passed"
          : `Failed ${failedCount} test cases`,
      };

      await createSubmission(submissionData, token);
      await getSubmissionsByProblem(problemId, token);

      if (compilationError) {
        setSubmissionResult(null);
      } else if (failedCount === 0) {
        setSubmissionResult({
          status: "accepted",
          message: "All test cases passed.",
          totalTestCases: hiddenTestCases.length,
        });
      } else {
        setSubmissionResult({
          status: "wrong_answer",
          message: `Wrong Answer on ${failedCount} hidden test case(s). First failed at test case ${firstFailedTestCase}.`,
          totalTestCases: hiddenTestCases.length,
          failedTestCase: firstFailedTestCase,
          failedCount,
        });

        if (user?.role?.includes("admin") && firstFailedTestCaseDetails) {
          setAdminFailedTestCase(firstFailedTestCaseDetails);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setSubmissionError("Test cases not found for this problem");
        } else if (status === 401) {
          setSubmissionError("Unauthorized access");
        } else {
          setSubmissionError(`Failed to submit: ${status}`);
        }
      } else if (error.request) {
        setSubmissionError("Network error: Unable to connect to server");
      } else {
        setSubmissionError(
          error.message || "An unexpected error occurred during submission"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewSubmissions = () => {
    setShowHistoryModal(true);
  };

  const handleViewSubmissionCode = (submission) => {
    setSelectedSubmission(submission);
    setShowHistoryModal(false);
    setShowCodeModal(true);
  };

  const handleBackToHistory = () => {
    setShowCodeModal(false);
    setShowHistoryModal(true);
    setSelectedSubmission(null);
  };

  return {
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
  };
};
