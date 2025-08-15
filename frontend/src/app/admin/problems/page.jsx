"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Tag,
  TestTube,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useProblemStore } from "@/store/problemStore";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

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

  const getDifficultyColor = (difficulty) => {
    const isDark = theme === "dark";
    switch (difficulty) {
      case "easy":
        return isDark
          ? "bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50 border-emerald-700"
          : "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium":
        return isDark
          ? "bg-amber-900/30 text-amber-300 hover:bg-amber-900/50 border-amber-700"
          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "hard":
        return isDark
          ? "bg-red-900/30 text-red-300 hover:bg-red-900/50 border-red-700"
          : "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return isDark
          ? "bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 border-gray-600"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const slugify = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Coding Problems
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Challenge yourself with our curated collection of coding
                problems
              </p>
            </div>

            <div className="flex items-center gap-3">
              {canManageProblems && (
                <Button
                  onClick={() => router.push("/admin/problems/create")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Problem
                </Button>
              )}
            </div>
          </div>
        </div>

          <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                 <CardContent className="p-6">
                   <div className="space-y-4">
                     <div className="flex flex-col md:flex-row gap-4">
                       <div className="flex-1 relative">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                         <Input
                           placeholder="Search problems by title, description, or tags..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="pl-12 h-12 text-base border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-gray-100 rounded-xl"
                         />
                       </div>
       
                       <div className="flex flex-col md:flex-row gap-4 items-center">
                         <Select
                           value={selectedDifficulty}
                           onValueChange={setSelectedDifficulty}
                         >
                           <SelectTrigger className="h-12 w-full md:w-40 border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-xl">
                             <SelectValue placeholder="Difficulty" />
                           </SelectTrigger>
                           <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                             <SelectItem value="all">All Difficulties</SelectItem>
                             <SelectItem value="easy">Easy</SelectItem>
                             <SelectItem value="medium">Medium</SelectItem>
                             <SelectItem value="hard">Hard</SelectItem>
                           </SelectContent>
                         </Select>
       
                         {(searchQuery || selectedDifficulty !== "all") && (
                           <Button
                             type="button"
                             variant="outline"
                             onClick={() => {
                               setSearchQuery("");
                               setSelectedDifficulty("all");
                               getAllProblems(1, 12);
                             }}
                             className="h-12 px-6 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                           >
                             Clear Filters
                           </Button>
                         )}
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {problems.map((problem) => (
            <Card
              key={problem._id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 hover:-translate-y-1 cursor-pointer"
              onClick={() =>
                router.push(
                  `/problems/${slugify(problem.title)}-${problem._id}`
                )
              }
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {problem.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(problem.createdAt)}
                      </span>
                    </div>
                  </div>

                  {canManageProblems && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => e.stopPropagation()} 
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="dark:bg-gray-800 dark:border-gray-600"
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/problems/${problem._id}`);
                          }}
                          className="dark:hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/problems/${problem._id}/edit`);
                          }}
                          className="dark:hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/admin/problems/${problem._id}/testcases`
                            );
                          }}
                          className="dark:hover:bg-gray-700"
                        >
                          <TestTube className="w-4 h-4 mr-2" />
                          Test Cases
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialog({ open: true, problem });
                          }}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>

              <CardContent className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {problem.description}
              </CardContent>

              <div className="px-6 pb-4 pt-2 flex flex-wrap gap-2">
                {problem.tags?.slice(0, 3).map((tag, idx) => (
                  <Badge
                    key={idx}
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 dark:border-blue-700"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Prev
          </Button>
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
            Page {pagination.page} of {pagination.pages}
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, problem: null })}
      >
        <DialogContent className="dark:bg-gray-800 dark:border-gray-600">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              Delete Problem
            </DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Are you sure you want to delete this problem? This action is
              irreversible.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, problem: null })}
              className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProblem}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProblemsPage;
