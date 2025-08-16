"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProblemStore } from "@/store/problemStore";
import { ProblemHeader } from "@/components/ProblemCreatePageComponents/ProblemHeader";
import { NavigationTabs } from "@/components/ProblemCreatePageComponents/NavigationTabs";
import { BasicInfoTab } from "@/components/ProblemCreatePageComponents/BasicInfoTab";
import { DescriptionTab } from "@/components/ProblemCreatePageComponents/DescriptionTab";
import { FormatTab } from "@/components/ProblemCreatePageComponents/FormatTab";
import { TestCasesTab } from "@/components/ProblemCreatePageComponents/TestCasesTab";

export default function ProblemSetterForm() {
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

  const [previewModes, setPreviewModes] = useState({
    title: false,
    description: false,
    inputFormat: false,
    outputFormat: false,
    constraints: false,
    testCases: {},
  });

  const [activeTab, setActiveTab] = useState("basic");
  const { user, token, isLoggedIn, isInitialized } = useAuthStore();
  const { createProblem } = useProblemStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isInitialized, router]);

  useEffect(() => {
    if (!user || !Array.isArray(user.role)) return;

    const hasAccess =
      user.role.includes("admin") || user.role.includes("problemSetter");

    if (!hasAccess) {
      router.push("/");
    }
  }, [user, router]);

  const handleInputChange = (field, value) => {
    setProblemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = problemData.sampleTestCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setProblemData((prev) => ({
      ...prev,
      sampleTestCases: updatedTestCases,
    }));
  };

  const addTestCase = () => {
    setProblemData((prev) => ({
      ...prev,
      sampleTestCases: [
        { input: "", expectedOutput: "", explanation: "" },
        ...prev.sampleTestCases,
      ],
    }));
  };

  const removeTestCase = (index) => {
    if (problemData.sampleTestCases.length > 1) {
      setProblemData((prev) => ({
        ...prev,
        sampleTestCases: prev.sampleTestCases.filter((_, i) => i !== index),
      }));

      setPreviewModes((prev) => ({
        ...prev,
        testCases: {
          ...prev.testCases,
          [index]: undefined,
        },
      }));
    }
  };

  const togglePreviewMode = (field, testCaseIndex = null) => {
    if (testCaseIndex !== null) {
      setPreviewModes((prev) => ({
        ...prev,
        testCases: {
          ...prev.testCases,
          [testCaseIndex]: !prev.testCases[testCaseIndex],
        },
      }));
    } else {
      setPreviewModes((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Authentication required. Please login first.");
      return;
    }

    try {
      const createdProblem = await createProblem(problemData, token);

      if (createdProblem) {
        setProblemData({
          title: "",
          description: "",
          inputFormat: "",
          outputFormat: "",
          constraints: "",
          difficulty: "easy",
          tags: [],
          sampleTestCases: [{ input: "", expectedOutput: "", explanation: "" }],
        });

        setPreviewModes({
          title: false,
          description: false,
          inputFormat: false,
          outputFormat: false,
          constraints: false,
          testCases: {},
        });

        setActiveTab("basic");
      }
    } catch (error) {
      console.error("Problem creation failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <ProblemHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <TabsContent value="basic" className="space-y-6">
            <BasicInfoTab
              problemData={problemData}
              previewModes={previewModes}
              onInputChange={handleInputChange}
              onTogglePreview={togglePreviewMode}
            />
          </TabsContent>

          <TabsContent value="description" className="space-y-6">
            <DescriptionTab
              problemData={problemData}
              previewModes={previewModes}
              onInputChange={handleInputChange}
              onTogglePreview={togglePreviewMode}
            />
          </TabsContent>

          <TabsContent value="format" className="space-y-6">
            <FormatTab
              problemData={problemData}
              previewModes={previewModes}
              onInputChange={handleInputChange}
              onTogglePreview={togglePreviewMode}
            />
          </TabsContent>

          <TabsContent value="testcases" className="space-y-6">
            <TestCasesTab
              problemData={problemData}
              previewModes={previewModes}
              onTestCaseChange={handleTestCaseChange}
              onAddTestCase={addTestCase}
              onRemoveTestCase={removeTestCase}
              onTogglePreview={togglePreviewMode}
              onSubmit={handleSubmit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}