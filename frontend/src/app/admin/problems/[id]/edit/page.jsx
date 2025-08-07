"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  BookOpen,
  Code,
  Target,
  Tag,
  AlertCircle,
  CheckCircle,
  Sparkles,
  FileText,
  Settings,
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProblemEditPage() {
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
  const [previewMode, setPreviewMode] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { user, token, isLoggedIn, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      router.push("/login");
      return;
    }
  }, [isLoggedIn, isInitialized, router]);

  useEffect(() => {
    if (!user || !Array.isArray(user.role)) return;

    const hasAccess =
      user.role.includes("admin") || user.role.includes("problemSetter");

    if (!hasAccess) {
      router.push("/");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    if (params.id && token) {
      fetchProblemData();
    }
  }, [params.id, token]);

  useEffect(() => {
    // Check if data has changed
    if (originalData) {
      const hasChanged =
        JSON.stringify(problemData) !== JSON.stringify(originalData);
      setHasChanges(hasChanged);
    }
  }, [problemData, originalData]);

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

  const difficultyConfig = {
    easy: {
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      textColor: "text-emerald-700 dark:text-emerald-300",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    medium: {
      color: "bg-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      textColor: "text-amber-700 dark:text-amber-300",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    hard: {
      color: "bg-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
      textColor: "text-red-700 dark:text-red-300",
      borderColor: "border-red-200 dark:border-red-800",
    },
  };

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
    }
  };

  const addTag = () => {
    if (
      currentTag.trim() &&
      !problemData.tags.includes(currentTag.trim().toLowerCase())
    ) {
      setProblemData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setProblemData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
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

  const renderMarkdownPreview = (text) => {
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100">
        {text.split("\n").map((line, i) => {
          if (line.startsWith("# ")) {
            return (
              <h1
                key={i}
                className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100"
              >
                {line.slice(2)}
              </h1>
            );
          } else if (line.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200"
              >
                {line.slice(3)}
              </h2>
            );
          } else if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={i} className="font-semibold mb-2">
                {line.slice(2, -2)}
              </p>
            );
          } else if (line.trim() === "") {
            return <br key={i} />;
          } else {
            return (
              <p key={i} className="mb-2 leading-relaxed">
                {line}
              </p>
            );
          }
        })}
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 max-w-md">
          <div className="flex flex-col items-center space-y-4 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Error Loading Problem
            </h2>
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-3">
              <Button onClick={fetchProblemData} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleGoBack}>Go Back</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Sticky Header - Only on md+ screens */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-blue-50/90 via-white/90 to-purple-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-purple-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2 border-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Problems
            </Button>

            <div className="text-center flex-1 mx-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl mb-3 shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                Edit Problem
              </h1>
              <p className="text-sm text-muted-foreground">
                Modify and improve your coding problem
              </p>
            </div>

            {hasChanges && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header - Only on small screens */}
      <div className="md:hidden py-8 px-4">
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl mb-4 shadow-lg">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Edit Problem
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Modify and improve your coding problem
          </p>

          {hasChanges && (
            <Alert className="max-w-sm mx-auto bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Sticky Tabs - Only on md+ screens */}
          <div className="sticky top-[165px] z-40 mb-8 hidden md:block">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-lg rounded-xl">
              <TabsTrigger
                value="basic"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                <BookOpen className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger
                value="format"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                <Settings className="h-4 w-4" />
                I/O Format
              </TabsTrigger>
              <TabsTrigger
                value="testcases"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                <CheckCircle className="h-4 w-4" />
                Test Cases
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile Tabs - Vertical layout on small screens */}
          <div className="md:hidden mb-8">
            <TabsList className="flex flex-col h-auto w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-lg rounded-xl p-2 space-y-2">
              <TabsTrigger
                value="basic"
                className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                <BookOpen className="h-5 w-5" />
                Basic Information
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                <FileText className="h-5 w-5" />
                Description
              </TabsTrigger>
              <TabsTrigger
                value="format"
                className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                <Settings className="h-5 w-5" />
                Input/Output Format
              </TabsTrigger>
              <TabsTrigger
                value="testcases"
                className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                <CheckCircle className="h-5 w-5" />
                Sample Test Cases
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">
                    Problem Title *
                  </Label>
                  <Input
                    id="title"
                    value={problemData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter an engaging problem title..."
                    className="h-12 text-lg border-2 focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Difficulty */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">
                      Difficulty Level *
                    </Label>
                    <Select
                      value={problemData.difficulty}
                      onValueChange={(value) =>
                        handleInputChange("difficulty", value)
                      }
                    >
                      <SelectTrigger className="h-12 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            Easy
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            Medium
                          </div>
                        </SelectItem>
                        <SelectItem value="hard">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            Hard
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Current Difficulty Display */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">
                      Selected Difficulty
                    </Label>
                    <div
                      className={`h-12 rounded-lg border-2 flex items-center justify-center ${
                        difficultyConfig[problemData.difficulty]?.bgColor
                      } ${
                        difficultyConfig[problemData.difficulty]?.borderColor
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            difficultyConfig[problemData.difficulty]?.color
                          }`}
                        ></div>
                        <span
                          className={`font-semibold capitalize ${
                            difficultyConfig[problemData.difficulty]?.textColor
                          }`}
                        >
                          {problemData.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      placeholder="Add tags (e.g., arrays, dp, graph)"
                      className="flex-1 h-11 border-2"
                    />
                    <Button
                      onClick={addTag}
                      className="h-11 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {problemData.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                      {problemData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 cursor-pointer transition-colors flex items-center gap-1"
                          onClick={() => removeTag(tag)}
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                          <button className="ml-1 hover:text-red-600 transition-colors">
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Description Tab */}
          <TabsContent value="description" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Code className="h-6 w-6 text-purple-600" />
                    Problem Description
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2 border-2"
                  >
                    {previewMode ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {previewMode ? "Edit" : "Preview"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!previewMode ? (
                  <div className="space-y-3">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You can use markdown formatting for better presentation.
                        Use **bold**, *italic*, and # headers.
                      </AlertDescription>
                    </Alert>
                    <Textarea
                      value={problemData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="# Problem Title

Write your problem description here with markdown support..."
                      className="min-h-[400px] font-mono text-sm border-2 focus:border-purple-500 transition-all resize-none"
                    />
                  </div>
                ) : (
                  <div className="min-h-[400px] p-6 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                    {problemData.description ? (
                      renderMarkdownPreview(problemData.description)
                    ) : (
                      <p className="text-muted-foreground italic">
                        No description provided yet...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* I/O Format Tab */}
          <TabsContent value="format" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Format */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="h-5 w-5 text-green-600" />
                    Input Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={problemData.inputFormat}
                    onChange={(e) =>
                      handleInputChange("inputFormat", e.target.value)
                    }
                    placeholder="Describe the input format..."
                    className="min-h-[200px] border-2 focus:border-green-500 transition-all resize-none"
                  />
                </CardContent>
              </Card>

              {/* Output Format */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="h-5 w-5 text-orange-600" />
                    Output Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={problemData.outputFormat}
                    onChange={(e) =>
                      handleInputChange("outputFormat", e.target.value)
                    }
                    placeholder="Describe the output format..."
                    className="min-h-[200px] border-2 focus:border-orange-500 transition-all resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Constraints */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Constraints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={problemData.constraints}
                  onChange={(e) =>
                    handleInputChange("constraints", e.target.value)
                  }
                  placeholder="Define the problem constraints..."
                  className="min-h-[150px] border-2 focus:border-red-500 transition-all resize-none"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Cases Tab */}
          <TabsContent value="testcases" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    Sample Test Cases
                  </CardTitle>
                  <Button
                    onClick={addTestCase}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Test Case
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {problemData.sampleTestCases.map((testCase, index) => (
                  <Card
                    key={index}
                    className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          Test Case {index + 1}
                        </CardTitle>
                        {problemData.sampleTestCases.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTestCase(index)}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-green-700 dark:text-green-400">
                            Input *
                          </Label>
                          <Textarea
                            value={testCase.input}
                            onChange={(e) =>
                              handleTestCaseChange(
                                index,
                                "input",
                                e.target.value
                              )
                            }
                            placeholder="Sample input..."
                            className="h-24 font-mono text-sm border-2 focus:border-green-500 transition-all resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                            Expected Output *
                          </Label>
                          <Textarea
                            value={testCase.expectedOutput}
                            onChange={(e) =>
                              handleTestCaseChange(
                                index,
                                "expectedOutput",
                                e.target.value
                              )
                            }
                            placeholder="Expected output..."
                            className="h-24 font-mono text-sm border-2 focus:border-blue-500 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                          Explanation (Optional)
                        </Label>
                        <Textarea
                          value={testCase.explanation}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              "explanation",
                              e.target.value
                            )
                          }
                          placeholder="Explain this test case..."
                          className="h-20 border-2 focus:border-purple-500 transition-all resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Update Section - Only shown in Test Cases tab */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Ready to Update Your Problem?
                    </h3>
                    <p className="text-muted-foreground">
                      Review all changes and click update to save your
                      modifications.
                    </p>
                  </div>

                  <Separator className="w-24" />

                  {hasChanges && (
                    <Alert className="max-w-md bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <AlertDescription className="text-amber-800 dark:text-amber-300">
                        You have unsaved changes that will be lost if you
                        navigate away.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={handleGoBack}
                      variant="outline"
                      className="px-8 py-6 text-lg border-2"
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      disabled={isSaving || !hasChanges}
                      className="px-12 py-6 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Update Problem
                        </>
                      )}
                    </Button>
                  </div>

                  {!hasChanges && (
                    <p className="text-sm text-muted-foreground">
                      No changes detected. Make some modifications to enable the
                      update button.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
