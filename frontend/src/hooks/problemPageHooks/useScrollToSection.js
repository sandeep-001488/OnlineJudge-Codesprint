import { useEffect } from "react";
import { useAIStore } from "@/store/aiStore";

export const useScrollToSection = ({
  error,
  submissionError,
  hasRun,
  customInput,
  customInputExecuted,
  output,
  testCaseResults,
}) => {
  const { responses } = useAIStore();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        const errorElement = document.getElementById("error-section");
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 200);
    }
  }, [error]);

  // Scroll to submission error section
  useEffect(() => {
    if (submissionError) {
      setTimeout(() => {
        const submissionErrorElement = document.getElementById(
          "submission-error-section"
        );
        if (submissionErrorElement) {
          submissionErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 200);
    }
  }, [submissionError]);

  // Scroll to results after running
  useEffect(() => {
    if (hasRun && !error && !submissionError) {
      setTimeout(() => {
        if (customInput.trim() && customInputExecuted && output) {
          const customInputElement = document.getElementById(
            "customInput-section"
          );
          if (customInputElement) {
            customInputElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        } else if (testCaseResults.length > 0) {
          const testCasesElement = document.getElementById("testCases-section");
          if (testCasesElement) {
            testCasesElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        }
      }, 200);
    }
  }, [
    hasRun,
    error,
    submissionError,
    customInput,
    customInputExecuted,
    output,
    testCaseResults,
  ]);

  // Scroll to AI responses
  useEffect(() => {
    const hasAnyResponse = Object.values(responses).some((response) => {
      return (
        response &&
        response !== "" &&
        response !== null &&
        response !== undefined
      );
    });

    if (hasAnyResponse) {
      setTimeout(() => {
        const aiResponsesElement = document.getElementById("ai-responses");
        if (aiResponsesElement) {
          aiResponsesElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 500);
    }
  }, [responses]);
};
