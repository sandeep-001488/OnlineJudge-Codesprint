"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProblemStore } from "@/store/problemStore";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useProblemActions } from "@/hooks/AdminProblemPageHooks/useProblemActions";
import { ProblemHeader } from "@/components/AdminProblemPageComponents/ProblemHeader";
import { ProblemFilters } from "@/components/AdminProblemPageComponents/ProblemFilters";
import { ProblemGrid } from "@/components/AdminProblemPageComponents/ProblemGrid";
import { Pagination } from "@/components/AdminProblemPageComponents/Pagination";
import { DeleteConfirmationDialog } from "@/components/AdminProblemPageComponents/DeleteConfirmationDialog";
import { formatDate, getDifficultyColor } from "@/lib/ProblemUtils";


const AdminProblemsPage = () => {
  const router = useRouter();
  const {
    problems,
    pagination,
    getAllProblems,
    deleteProblem,
    searchProblems,
    clearError,
  } = useProblemStore();

  const { user, token, isLoggedIn, isInitialized } = useAuthStore();
  const { theme, initializeTheme, isHydrated } = useThemeStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    problem: null,
  });

  const {
    handleCardClick,
    handleView,
    handleEdit,
    handleTestCases,
    handleCreateClick,
  } = useProblemActions(router);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

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

  const canManageProblems =
    isLoggedIn &&
    (user?.role.includes("admin") || user?.role.includes("problemSetter"));

  useEffect(() => {
    getAllProblems(1, 12);
    return () => clearError();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearchOrFilter();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedDifficulty]);

  const handleSearchOrFilter = async () => {
    const filters = {};
    if (selectedDifficulty !== "all") {
      filters.difficulty = selectedDifficulty;
    }

    if (searchQuery.trim()) {
      await searchProblems(searchQuery, filters);
    } else {
      await getAllProblems(1, 12, filters);
    }
  };

  const handleDeleteProblem = async () => {
    if (!deleteDialog.problem || !token) return;

    try {
      await deleteProblem(deleteDialog.problem._id, token);
      setDeleteDialog({ open: false, problem: null });
    } catch (error) {}
  };

  const handlePageChange = (newPage) => {
    if (searchQuery.trim()) {
      return;
    }
    const filters = {};
    if (selectedDifficulty !== "all") {
      filters.difficulty = selectedDifficulty;
    }
    getAllProblems(newPage, 12, filters);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty("all");
    getAllProblems(1, 12);
  };

  const handleDelete = (problem) => {
    setDeleteDialog({ open: true, problem });
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <ProblemHeader
          canManageProblems={canManageProblems}
          onCreateClick={handleCreateClick}
        />

        <ProblemFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          onClearFilters={handleClearFilters}
          showClearButton={searchQuery || selectedDifficulty !== "all"}
        />

        <ProblemGrid
          problems={problems}
          canManageProblems={canManageProblems}
          onCardClick={handleCardClick}
          onView={handleView}
          onEdit={handleEdit}
          onTestCases={handleTestCases}
          onDelete={handleDelete}
          getDifficultyColor={(difficulty) =>
            getDifficultyColor(difficulty, theme)
          }
          formatDate={formatDate}
          theme={theme}
        />

        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          disabled={searchQuery.trim()}
        />

        <DeleteConfirmationDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, problem: null })}
          onConfirm={handleDeleteProblem}
          problem={deleteDialog.problem}
        />
      </div>
    </div>
  );
};

export default AdminProblemsPage;