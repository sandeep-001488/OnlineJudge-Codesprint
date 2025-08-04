"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  TestTube,
  ArrowLeft,
  Save,
  X,
  Code,
  FileText,
  Check,
  AlertCircle,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { useTestCaseStore } from "@/store/testcaseStore";
import { useProblemStore } from "@/store/problemStore";
import { useAuthStore } from "@/store/authStore";

const TestCasesManagementPage = () => {
  const router = useRouter();
  const params = useParams();
  const problemId = params.id;

  const {
    currentProblem,
    isLoading: problemLoading,
    getProblemById,
  } = useProblemStore();

  // Using dedicated test case store
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
  // Changed filter state to use 'all', 'public', 'private'
  const [filterType, setFilterType] = useState("all");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
    if (!canManage && currentProblem && isInitialLoad) {
      toast.error(
        "You do not have permission to manage test cases for this problem"
      );
      router.push("/");
    }
  }, [canManage, currentProblem, isInitialLoad]);

  useEffect(() => {
    const loadData = async () => {
      if (problemId && token && isInitialLoad && isLoggedIn) {
        try {
          console.log("Component - Loading data for problem:", {
            problemId,
            hasToken: !!token,
            isLoggedIn,
            userRole: user?.role,
          });

          await getProblemById(problemId);

          const fetchedTestCases = await getTestCasesByProblemId(
            problemId,
            true,
            token
          );
        } catch (error) {
          console.error("Component - Error loading data:", error);
        } finally {
          setIsInitialLoad(false);
        }
      } else {
        console.log("Component - Skipping data load:", {
          hasProblnemId: !!problemId,
          hasToken: !!token,
          isInitialLoad,
          isLoggedIn,
        });
      }
    };

    loadData();

    return () => {
      clearTestCases();
    };
  }, [
    problemId,
    token,
    isInitialLoad,
    isLoggedIn,
    getProblemById,
    getTestCasesByProblemId,
    clearTestCases,
  ]);

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="sticky top-16 z-40 bg-gradient-to-br from-blue-50/95 via-white/95 to-purple-50/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-purple-900/20 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 -mx-4 px-4 py-3 mb-6">
          <div className="flex flex-col space-y-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/problems")}
              className="self-start hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Problems
            </Button>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Test Cases Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Managing test cases for:{" "}
                  <span className="font-medium">{currentProblem?.title}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={getDifficultyColor(currentProblem?.difficulty)}
                  >
                    {currentProblem?.difficulty}
                  </Badge>
                </div>
              </div>

              <Dialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
              >
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Test Case
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-600">
                  <DialogHeader>
                    <DialogTitle className="dark:text-gray-100">
                      Create New Test Case
                    </DialogTitle>
                    <DialogDescription className="dark:text-gray-300">
                      Add a new test case for this problem. Make sure the input
                      and output are correct.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleCreateTestCase} className="space-y-4">
                    <div>
                      <Label htmlFor="input" className="dark:text-gray-200">
                        Input
                      </Label>
                      <Textarea
                        id="input"
                        placeholder="Enter test case input..."
                        value={formData.input}
                        onChange={(e) =>
                          setFormData({ ...formData, input: e.target.value })
                        }
                        className="w-full min-h-24 font-mono text-sm p-3 border border-gray-300 rounded-md 
               dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
               resize-y break-all"
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="expectedOutput"
                        className="dark:text-gray-200"
                      >
                        Expected Output
                      </Label>

                      <Textarea
                        id="expectedOutput"
                        placeholder="Enter expected output..."
                        value={formData.expectedOutput}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expectedOutput: e.target.value,
                          })
                        }
                        className="w-full min-h-24 font-mono text-sm p-3 border border-gray-300 rounded-md 
               dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
               resize-y break-all"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isPublic: checked })
                        }
                      />
                      <Label
                        htmlFor="isPublic"
                        className="text-sm dark:text-gray-200"
                      >
                        Make this test case public (visible to users)
                      </Label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateDialog(false)}
                        className="dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        {isLoading ? "Creating..." : "Create Test Case"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Card className="shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("all")}
                    className="flex items-center space-x-1"
                  >
                    <List className="w-3 h-3" />
                    <span>All ({counts.total})</span>
                  </Button>
                  <Button
                    variant={filterType === "public" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("public")}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Public ({counts.public})</span>
                  </Button>
                  <Button
                    variant={filterType === "private" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType("private")}
                    className="flex items-center space-x-1"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>Private ({counts.private})</span>
                  </Button>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredTestCases.length} of {testCases.length} test
                  cases
                  {filterType !== "all" && (
                    <span className="font-medium ml-1">
                      ({filterType === "public" ? "Public" : "Private"} only)
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <TestTube className="w-4 h-4" />
                    <span>Total: {counts.total}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>Public: {counts.public}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <EyeOff className="w-4 h-4" />
                    <span>Private: {counts.private}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Cases Grid - RESPONSIVE GRID LAYOUT */}
        <div className="mb-8">
          {testCaseLoading && testCases.length === 0 ? (
            <Card className="text-center py-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading test cases...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : filteredTestCases.length === 0 ? (
            <Card className="text-center py-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <TestTube className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No test cases found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {filterType === "all"
                        ? "No test cases have been created yet."
                        : filterType === "public"
                        ? "No public test cases available."
                        : "No private test cases available."}
                    </p>
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Test Case
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* RESPONSIVE GRID - 1 col on mobile, 2 on tablet, 3 on desktop */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTestCases.map((testCase, index) => (
                <Card
                  key={testCase._id}
                  className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 flex flex-col"
                >
                  <CardHeader className="pb-2 py-3 flex-shrink-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-base dark:text-gray-100">
                          Test Case #{index + 1}
                        </CardTitle>
                        <Badge
                          variant={testCase.isPublic ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {testCase.isPublic ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Public
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Private
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(testCase)}
                          disabled={editingTestCase?._id === testCase._id}
                          className="h-8 w-8 p-0 dark:hover:bg-gray-700"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setDeleteDialog({ open: true, testCase })
                          }
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    {editingTestCase?._id === testCase._id ? (
                      <form
                        onSubmit={handleUpdateTestCase}
                        className="space-y-3 flex-1 flex flex-col"
                      >
                        <div className="flex-1">
                          <Label
                            htmlFor={`edit-input-${testCase._id}`}
                            className="text-sm dark:text-gray-200"
                          >
                            Input
                          </Label>
                          {/* <Textarea
                            id={`edit-input-${testCase._id}`}
                            value={formData.input}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                input: e.target.value,
                              })
                            }
                            className="min-h-16 font-mono text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 resize-none"
                            required
                          /> */}
                          <Textarea
                            id={`edit-input-${testCase._id}`}
                            value={formData.input}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                input: e.target.value,
                              })
                            }
                            className="w-full min-h-16 font-mono text-xs p-2 border border-gray-300 rounded-md
             dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 
             resize-y overflow-wrap-anywhere break-words"
                            style={{
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "pre-wrap",
                            }}
                            required
                          />
                        </div>

                        <div className="flex-1">
                          <Label
                            htmlFor={`edit-output-${testCase._id}`}
                            className="text-sm dark:text-gray-200"
                          >
                            Expected Output
                          </Label>
                          {/* <Textarea
                            id={`edit-output-${testCase._id}`}
                            value={formData.expectedOutput}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expectedOutput: e.target.value,
                              })
                            }
                            className="min-h-16 font-mono text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 resize-none"
                            required
                          /> */}
                          <Textarea
                            id={`edit-output-${testCase._id}`}
                            value={formData.expectedOutput}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expectedOutput: e.target.value,
                              })
                            }
                            className="w-full min-h-16 font-mono text-xs p-2 border border-gray-300 rounded-md
             dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 
             resize-y overflow-wrap-anywhere break-words"
                            style={{
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "pre-wrap",
                            }}
                            required
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`edit-public-${testCase._id}`}
                            checked={formData.isPublic}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, isPublic: checked })
                            }
                          />
                          <Label
                            htmlFor={`edit-public-${testCase._id}`}
                            className="text-xs dark:text-gray-200"
                          >
                            Public test case
                          </Label>
                        </div>

                        <div className="flex justify-end space-x-2 mt-auto pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={cancelEditing}
                            className="dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            disabled={isLoading}
                            className="dark:bg-blue-500 dark:hover:bg-blue-600"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            {isLoading ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-3 flex-1 flex flex-col">
                        <div className="flex-1">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Input
                          </Label>
                          <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-md border dark:border-gray-600 max-h-20 overflow-y-auto">
                            <pre className="text-xs font-mono whitespace-pre-wrap dark:text-gray-200 break-words">
                              {testCase.input}
                            </pre>
                          </div>
                        </div>

                        <div className="flex-1">
                          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Expected Output
                          </Label>
                          <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-md border dark:border-gray-600 max-h-20 overflow-y-auto">
                            <pre className="text-xs font-mono whitespace-pre-wrap dark:text-gray-200 break-words">
                              {testCase.expectedOutput}
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, testCase: null })}
        >
          <DialogContent className="dark:bg-gray-800 dark:border-gray-600">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                Delete Test Case
              </DialogTitle>
              <DialogDescription className="dark:text-gray-300">
                Are you sure you want to delete this test case? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, testCase: null })}
                className="dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteTestCase}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TestCasesManagementPage;
