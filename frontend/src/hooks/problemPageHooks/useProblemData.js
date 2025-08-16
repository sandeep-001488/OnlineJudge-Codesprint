import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useProblemStore } from "@/store/problemStore";

export const useProblemData = (problemId) => {
  const router = useRouter();
  const [problem, setProblem] = useState(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [problemError, setProblemError] = useState(null);

  const { isInitialized, isLoggedIn, authHydrated, checkAuth, getUserId } =
    useAuthStore();
  const { getProblemById } = useProblemStore();
  const userId = getUserId();

  useEffect(() => {
    if (authHydrated && !isInitialized) {
      checkAuth();
    }
  }, [authHydrated, isInitialized]);

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.push("/login");
    }
  }, [isInitialized, isLoggedIn]);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId || !userId) {
        if (isInitialized && !userId) {
          setProblemError("User not found");
        }
        setIsLoadingProblem(false);
        return;
      }

      try {
        setIsLoadingProblem(true);
        setProblemError(null);

        const problemData = await getProblemById(problemId);

        if (problemData) {
          setProblem({
            title: problemData.title,
            description: problemData.description,
            inputFormat: problemData.inputFormat,
            outputFormat: problemData.outputFormat,
            constraints: problemData.constraints,
            sampleTestCases:
              problemData.sampleTestCases || problemData.testCases || [],
            difficulty: problemData.difficulty,
            tags: problemData.tags || [],
          });
        } else {
          setProblemError("Problem not found");
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        setProblemError(error.message || "Failed to fetch problem");
      } finally {
        setIsLoadingProblem(false);
      }
    };

    if (problemId && isInitialized && isLoggedIn && userId) {
      fetchProblem();
    }
  }, [problemId, isInitialized, isLoggedIn, userId, getProblemById]);

  return {
    problem,
    isLoadingProblem,
    problemError,
    userId,
    isInitialized,
    isLoggedIn,
  };
};
