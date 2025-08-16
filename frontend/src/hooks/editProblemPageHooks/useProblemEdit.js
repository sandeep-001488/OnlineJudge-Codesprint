import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { toast } from "sonner";

export const useProblemEdit = () => {
  const [problemData, setProblemData] = useState({
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    difficulty: "easy",
    tags: [],
    sampleTestCases: [{ input: "", expectedOutput: "", explanation: "" }],
  });

  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { user, token, isLoggedIn, isInitialized } = useAuthStore();

  // Check if data has changed
  useEffect(() => {
    if (originalData) {
      const hasChanged =
        JSON.stringify(problemData) !== JSON.stringify(originalData);
      setHasChanges(hasChanged);
    }
  }, [problemData, originalData]);

  // Auth check
  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.push("/login");
      return;
    }
  }, [isLoggedIn, isInitialized, router]);

  // Permission check
  useEffect(() => {
    if (!user || !Array.isArray(user.role)) return;

    const hasAccess =
      user.role.includes("admin") || user.role.includes("problemSetter");

    if (!hasAccess) {
      router.push("/");
      return;
    }
  }, [user, router]);

  // Fetch problem data
  useEffect(() => {
    if (params.id && token) {
      fetchProblemData();
    }
  }, [params.id, token]);

  const fetchProblemData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}problems/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const problemDataFromAPI = response.data;

      const formattedData = {
        title:
          problemDataFromAPI.problem?.title || problemDataFromAPI.title || "",
        description:
          problemDataFromAPI.problem?.description ||
          problemDataFromAPI.description ||
          "",
        inputFormat:
          problemDataFromAPI.problem?.inputFormat ||
          problemDataFromAPI.inputFormat ||
          "",
        outputFormat:
          problemDataFromAPI.problem?.outputFormat ||
          problemDataFromAPI.outputFormat ||
          "",
        constraints:
          problemDataFromAPI.problem?.constraints ||
          problemDataFromAPI.constraints ||
          "",
        difficulty:
          problemDataFromAPI.problem?.difficulty ||
          problemDataFromAPI.difficulty ||
          "easy",
        tags: problemDataFromAPI.problem?.tags || problemDataFromAPI.tags || [],
        sampleTestCases:
          (
            problemDataFromAPI.problem?.sampleTestCases ||
            problemDataFromAPI.sampleTestCases
          )?.length > 0
            ? problemDataFromAPI.problem?.sampleTestCases ||
              problemDataFromAPI.sampleTestCases
            : [{ input: "", expectedOutput: "", explanation: "" }],
      };

      setProblemData(formattedData);
      setOriginalData(JSON.parse(JSON.stringify(formattedData)));

      toast.success("Problem data loaded successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to load problem data";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching problem:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProblemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Authentication required. Please login first.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}problems/${params.id}`,
        problemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setOriginalData(JSON.parse(JSON.stringify(problemData)));
        setHasChanges(false);

        toast.success("Problem updated successfully!");

        setTimeout(() => {
          router.push("/admin/problems");
        }, 1500);
      }
    } catch (error) {
      console.error("Problem update failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update problem. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoBack = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    router.push("/admin/problems");
  };

  return {
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
  };
};
