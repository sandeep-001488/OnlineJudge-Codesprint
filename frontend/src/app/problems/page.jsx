"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Search,
  Filter,
  Code2,
  Clock,
  TrendingUp,
  Star,
  Users,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Play,
  BookOpen,
  Target,
  Zap,
} from "lucide-react";
import { useProblemStore } from "@/store/problemStore";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

const ProblemList = () => {
  const router = useRouter();
  const {
    problems,
    isLoading,
    pagination,
    getAllProblems,
    searchProblems,
    clearError,
  } = useProblemStore();

  const { user, isLoggedIn } = useAuthStore();
  const { theme, toggleTheme, initializeTheme, isHydrated } = useThemeStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    getAllProblems(1, 12);
    return () => clearError();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await searchProblems(searchQuery, {
        difficulty:
          selectedDifficulty !== "all" ? selectedDifficulty : undefined,
        tag: selectedTag !== "all" ? selectedTag : undefined,
      });
    } else {
      await getAllProblems(1, 12, {
        difficulty:
          selectedDifficulty !== "all" ? selectedDifficulty : undefined,
        tag: selectedTag !== "all" ? selectedTag : undefined,
      });
    }
  };

  const handlePageChange = (newPage) => {
    getAllProblems(newPage, 12, {
      difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
      tag: selectedTag !== "all" ? selectedTag : undefined,
    });
  };

  const handleProblemClick = (problemId) => {
    if (isLoggedIn) {
      router.push(`/problems/${problemId}`);
    } else {
      router.push("/login");
    }
  };

  const getDifficultyColor = (difficulty) => {
    const isDark = theme === "dark";
    switch (difficulty) {
      case "easy":
        return isDark
          ? "bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50 border-emerald-700/50"
          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
      case "medium":
        return isDark
          ? "bg-amber-900/30 text-amber-300 hover:bg-amber-900/50 border-amber-700/50"
          : "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200";
      case "hard":
        return isDark
          ? "bg-red-900/30 text-red-300 hover:bg-red-900/50 border-red-700/50"
          : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200";
      default:
        return isDark
          ? "bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 border-gray-600/50"
          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return <Target className="w-3 h-3" />;
      case "medium":
        return <Zap className="w-3 h-3" />;
      case "hard":
        return <Trophy className="w-3 h-3" />;
      default:
        return <Code2 className="w-3 h-3" />;
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900/20 transition-all duration-500">
      <div className="container mx-auto px-4 py-12">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              All Problems
            </h2>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {problems?.length || 0} problems
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
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

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-6 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                <Button
                  type="submit"
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {showFilters && (
                <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <Select
                      value={selectedDifficulty}
                      onValueChange={setSelectedDifficulty}
                    >
                      <SelectTrigger className="h-11 border-gray-200 dark:border-gray-600 dark:bg-gray-800 rounded-lg">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Topic/Tag
                    </label>
                    <Input
                      placeholder="Filter by topic or tag..."
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="h-11 border-gray-200 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-100 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Problems Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {problems.map((problem, index) => (
              <Card
                key={problem._id}
                onClick={() => handleProblemClick(problem._id)}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>

                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                        {problem.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getDifficultyColor(
                            problem.difficulty
                          )} border font-medium`}
                        >
                          {getDifficultyIcon(problem.difficulty)}
                          <span className="ml-1 capitalize">
                            {problem.difficulty}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <Play className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 leading-relaxed">
                    {problem.description}
                  </p>

                  {/* Tags */}
                  {problem.tags && problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.slice(0, 3).map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {problem.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{problem.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3" />
                      Solve Now
                    </div>
                  </div>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && problems.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Problems Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search criteria or filters to find the
                problems you're looking for.
              </p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("all");
                setSelectedTag("all");
                getAllProblems(1, 12);
              }}
              variant="outline"
              className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && problems.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(pagination.page - 1) * 12 + 1} to{" "}
              {Math.min(pagination.page * 12, pagination.total)} of{" "}
              {pagination.total} problems
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(pagination.pages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === pagination.page;

                  if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= pagination.page - 1 &&
                      pageNum <= pagination.page + 1)
                  ) {
                    return (
                      <Button
                        key={pageNum}
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          isCurrentPage
                            ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            : "border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  } else if (
                    pageNum === pagination.page - 2 ||
                    pageNum === pagination.page + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
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
        )}

        {/* Call to Action for Non-logged Users */}
        {!isLoggedIn && (
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Ready to Start Coding?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Join our community of developers and start solving problems
                    today!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/register")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sign Up Free
                  </Button>
                  <Button
                    onClick={() => router.push("/login")}
                    variant="outline"
                    className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemList;
