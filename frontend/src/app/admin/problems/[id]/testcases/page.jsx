"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useTestCaseStore } from "@/store/testcaseStore";
import { useProblemStore } from "@/store/problemStore";
import { useAuthStore } from "@/store/authStore";
import TestCaseHeader from "@/components/TestCasePageComponents/TestCaseHeader";
import TestCaseFilters from "@/components/TestCasePageComponents/TestCaseFilters";
import TestCasesList from "@/components/TestCasePageComponents/TestCasesList";
import CreateTestCaseDialog from "@/components/TestCasePageComponents/CreateTestCaseDialog";
import DeleteConfirmDialog from "@/components/TestCasePageComponents/DeleteConfirmDialog";

const TestCasesManagementPage = () => {
  const router = useRouter();
  const params = useParams();
  const problemId = params.id;

  const {
    currentProblem,
    isLoading: problemLoading,
    getProblemById,
  } = useProblemStore();

  const {
    testCases,
    isLoading: testCaseLoading,
    getTestCasesByProblemId,
    createTestCase,
    updateTestCase,
    deleteTestCase,
    clearTestCases,
  } = useTestCaseStore();

  const { isInitialised, isLoggedIn, user, token } = useAuthStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    testCase: null,
  });
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    input: "",
    expectedOutput: "",
    isPublic: false,
  });

  useEffect(() => {
    if (isInitialised && !isLoggedIn) {
      router.push("/login");
    }
  }, [isInitialised, router, isLoggedIn]);

  const canManage =
    user?.role?.includes("admin") ||
    (user?.role?.includes("problemSetter") &&
      currentProblem?.createdBy === user?._id);

  const isLoading = problemLoading || testCaseLoading;

  useEffect(() => {
    if (currentProblem && !canManage) {
      toast.error(
        "You do not have permission to manage test cases for this problem"
      );
      router.push("/");
    }
  }, [canManage, currentProblem, router]);

  useEffect(() => {
    const loadData = async () => {
      if (problemId && token && isLoggedIn) {
        try {
          await getProblemById(problemId);
          await getTestCasesByProblemId(problemId, {
            includePrivate: true,
            forSubmission: false,
            token: token,
          });
        } catch (error) {
          console.error("Component - Error loading data:", error);
        }
      }
    };

    loadData();
  }, [problemId, token, isLoggedIn, getProblemById, getTestCasesByProblemId]);

  useEffect(() => {
    return () => {
      clearTestCases();
    };
  }, [clearTestCases]);

  const resetForm = () => {
    setFormData({
      input: "",
      expectedOutput: "",
      isPublic: false,
    });
    setEditingTestCase(null);
  };

  const handleCreateTestCase = async (e) => {
    e.preventDefault();
    if (!formData.input.trim() || !formData.expectedOutput.trim()) {
      toast.error("Input and expected output are required");
      return;
    }

    try {
      await createTestCase(
        {
          problemId,
          ...formData,
        },
        token
      );

      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error creating test case:", error);
    }
  };

  const handleUpdateTestCase = async (e) => {
    e.preventDefault();
    if (
      !editingTestCase ||
      !formData.input.trim() ||
      !formData.expectedOutput.trim()
    ) {
      toast.error("Input and expected output are required");
      return;
    }

    try {
      await updateTestCase(editingTestCase._id, formData, token);
      resetForm();
    } catch (error) {
      console.error("Error updating test case:", error);
    }
  };

  const handleDeleteTestCase = async () => {
    if (!deleteDialog.testCase) return;

    try {
      await deleteTestCase(deleteDialog.testCase._id, token);
      setDeleteDialog({ open: false, testCase: null });
    } catch (error) {
      console.error("Error deleting test case:", error);
    }
  };

  const startEditing = (testCase) => {
    setEditingTestCase(testCase);
    setFormData({
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      isPublic: testCase.isPublic,
    });
  };

  const cancelEditing = () => {
    resetForm();
  };

  const getSortedAndFilteredTestCases = () => {
    let sortedTestCases = [...testCases].sort((a, b) => {
      const dateA = new Date(a.createdAt || a._id);
      const dateB = new Date(b.createdAt || b._id);
      return dateB - dateA;
    });

    switch (filterType) {
      case "public":
        return sortedTestCases.filter((tc) => tc.isPublic);
      case "private":
        return sortedTestCases.filter((tc) => !tc.isPublic);
      case "all":
      default:
        return sortedTestCases;
    }
  };

  const filteredTestCases = getSortedAndFilteredTestCases();

  const getTestCaseCounts = () => {
    const total = testCases.length;
    const publicCount = testCases.filter((tc) => tc.isPublic).length;
    const privateCount = total - publicCount;

    return { total, public: publicCount, private: privateCount };
  };

  const counts = getTestCaseCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <TestCaseHeader
          currentProblem={currentProblem}
          onCreateClick={() => setShowCreateDialog(true)}
        />

        <TestCaseFilters
          filterType={filterType}
          setFilterType={setFilterType}
          counts={counts}
          filteredTestCases={filteredTestCases}
          testCases={testCases}
        />

        <div className="mb-8">
          <TestCasesList
            testCaseLoading={testCaseLoading}
            filteredTestCases={filteredTestCases}
            testCases={testCases}
            filterType={filterType}
            editingTestCase={editingTestCase}
            formData={formData}
            setFormData={setFormData}
            onStartEditing={startEditing}
            onCancelEditing={cancelEditing}
            onUpdateSubmit={handleUpdateTestCase}
            onDelete={(testCase) => setDeleteDialog({ open: true, testCase })}
            onCreateClick={() => setShowCreateDialog(true)}
            isLoading={isLoading}
          />
        </div>

        <CreateTestCaseDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateTestCase}
          isLoading={isLoading}
        />

        <DeleteConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, testCase: null })}
          onConfirm={handleDeleteTestCase}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TestCasesManagementPage;