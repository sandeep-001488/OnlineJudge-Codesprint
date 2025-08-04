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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProblemStore } from "@/store/problemStore";

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

  // Separate preview states for each field
  const [previewModes, setPreviewModes] = useState({
    title: false,
    description: false,
    inputFormat: false,
    outputFormat: false,
    constraints: false,
    testCases: {}, // Will store preview state for each test case explanation
  });

  const [currentTag, setCurrentTag] = useState("");
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
    // Add new test case at the beginning (index 0)
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

      // Clean up preview state for removed test case
      setPreviewModes((prev) => ({
        ...prev,
        testCases: {
          ...prev.testCases,
          [index]: undefined,
        },
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

  const togglePreviewMode = (field, testCaseIndex = null) => {
    if (testCaseIndex !== null) {
      // Handle test case explanation preview
      setPreviewModes((prev) => ({
        ...prev,
        testCases: {
          ...prev.testCases,
          [testCaseIndex]: !prev.testCases[testCaseIndex],
        },
      }));
    } else {
      // Handle other field previews
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

        setCurrentTag("");
        setActiveTab("basic");
      }
    } catch (error) {
      console.error("Problem creation failed:", error);
    }
  };

  const renderMarkdownPreview = (text) => {
    if (!text)
      return (
        <p className="text-muted-foreground italic">No content provided...</p>
      );

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
          } else if (line.startsWith("### ")) {
            return (
              <h3
                key={i}
                className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200"
              >
                {line.slice(4)}
              </h3>
            );
          } else if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={i} className="font-semibold mb-2">
                {line.slice(2, -2)}
              </p>
            );
          } else if (line.includes("**")) {
            // Handle inline bold text
            const parts = line.split("**");
            return (
              <p key={i} className="mb-2 leading-relaxed">
                {parts.map((part, idx) =>
                  idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                )}
              </p>
            );
          } else if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <li key={i} className="mb-1 ml-4 list-disc">
                {line.slice(2)}
              </li>
            );
          } else if (line.trim() === "") {
            return <br key={i} />;
          } else {
            return (
              <p
                key={i}
                className="mb-2 leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {line}
              </p>
            );
          }
        })}
      </div>
    );
  };

  const PreviewToggleButton = ({ field, testCaseIndex = null }) => {
    const isPreview =
      testCaseIndex !== null
        ? previewModes.testCases[testCaseIndex]
        : previewModes[field];

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => togglePreviewMode(field, testCaseIndex)}
        className="flex items-center gap-2 border-2"
      >
        {isPreview ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        {isPreview ? "Edit" : "Preview"}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Sticky Header - Only on md+ screens */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-blue-50/90 via-white/90 to-purple-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-purple-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-3 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Create New Problem
            </h1>
            <p className="text-sm text-muted-foreground">
              Design challenging problems for the coding community
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Header - Only on small screens */}
      <div className="md:hidden py-8 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Problem
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Design challenging problems that will inspire and test the coding
            community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Sticky Tabs - Only on md+ screens */}
          <div className="sticky top-[165px] z-40 mb-8 hidden md:block">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-lg rounded-xl">
              <TabsTrigger
                value="basic"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <BookOpen className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger
                value="format"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <Settings className="h-4 w-4" />
                I/O Format
              </TabsTrigger>
              <TabsTrigger
                value="testcases"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
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
                className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <BookOpen className="h-5 w-5" />
                Basic Information
              </TabsTrigger>
              <TabsTrigger
                value="description"
                className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <FileText className="h-5 w-5" />
                Description
              </TabsTrigger>
              <TabsTrigger
                value="format"
                className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                <Settings className="h-5 w-5" />
                Input/Output Format
              </TabsTrigger>
              <TabsTrigger
                value="testcases"
                className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
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
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title with Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title" className="text-base font-semibold">
                      Problem Title *
                    </Label>
                    <PreviewToggleButton field="title" />
                  </div>

                  {!previewModes.title ? (
                    <Input
                      id="title"
                      value={problemData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter an engaging problem title..."
                      className="h-12 text-lg border-2 focus:border-blue-500 transition-all"
                    />
                  ) : (
                    <div className="h-12 p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 flex items-center">
                      {problemData.title ? (
                        renderMarkdownPreview(problemData.title)
                      ) : (
                        <p className="text-muted-foreground italic">
                          No title provided yet...
                        </p>
                      )}
                    </div>
                  )}
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
                        difficultyConfig[problemData.difficulty].bgColor
                      } ${
                        difficultyConfig[problemData.difficulty].borderColor
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            difficultyConfig[problemData.difficulty].color
                          }`}
                        ></div>
                        <span
                          className={`font-semibold capitalize ${
                            difficultyConfig[problemData.difficulty].textColor
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
                      className="h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {problemData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                      {problemData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer transition-colors flex items-center gap-1"
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
                  <PreviewToggleButton field="description" />
                </div>
              </CardHeader>
              <CardContent>
                {!previewModes.description ? (
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

Write your problem description here with markdown support...

## Example:
Given an array of integers, find the maximum sum of a contiguous subarray.

**Input:** An array of integers
**Output:** Maximum sum of contiguous subarray"
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
              {/* Input Format with Preview */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-5 w-5 text-green-600" />
                      Input Format
                    </CardTitle>
                    <PreviewToggleButton field="inputFormat" />
                  </div>
                </CardHeader>
                <CardContent>
                  {!previewModes.inputFormat ? (
                    <Textarea
                      value={problemData.inputFormat}
                      onChange={(e) =>
                        handleInputChange("inputFormat", e.target.value)
                      }
                      placeholder="Describe the input format...

Example:
- First line contains integer N (number of elements)
- Second line contains N space-separated integers"
                      className="min-h-[200px] border-2 focus:border-green-500 transition-all resize-none"
                    />
                  ) : (
                    <div className="min-h-[200px] p-4 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                      {renderMarkdownPreview(problemData.inputFormat)}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Output Format with Preview */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-5 w-5 text-orange-600" />
                      Output Format
                    </CardTitle>
                    <PreviewToggleButton field="outputFormat" />
                  </div>
                </CardHeader>
                <CardContent>
                  {!previewModes.outputFormat ? (
                    <Textarea
                      value={problemData.outputFormat}
                      onChange={(e) =>
                        handleInputChange("outputFormat", e.target.value)
                      }
                      placeholder="Describe the output format...

Example:
- Single integer representing the maximum sum"
                      className="min-h-[200px] border-2 focus:border-orange-500 transition-all resize-none"
                    />
                  ) : (
                    <div className="min-h-[200px] p-4 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                      {renderMarkdownPreview(problemData.outputFormat)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Constraints with Preview */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Constraints
                  </CardTitle>
                  <PreviewToggleButton field="constraints" />
                </div>
              </CardHeader>
              <CardContent>
                {!previewModes.constraints ? (
                  <Textarea
                    value={problemData.constraints}
                    onChange={(e) =>
                      handleInputChange("constraints", e.target.value)
                    }
                    placeholder="Define the problem constraints...

Example:
- 1 ≤ N ≤ 10^5
- -10^9 ≤ arr[i] ≤ 10^9
- Time Limit: 1 second
- Memory Limit: 256 MB"
                    className="min-h-[150px] border-2 focus:border-red-500 transition-all resize-none"
                  />
                ) : (
                  <div className="min-h-[150px] p-4 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                    {renderMarkdownPreview(problemData.constraints)}
                  </div>
                )}
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          Test Case {index + 1}
                          {index === 0 &&
                            problemData.sampleTestCases.length > 1 && (
                              <Badge
                                variant="secondary"
                                className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              >
                                New
                              </Badge>
                            )}
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
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                            Explanation (Optional)
                          </Label>
                          <PreviewToggleButton
                            field="explanation"
                            testCaseIndex={index}
                          />
                        </div>

                        {!previewModes.testCases[index] ? (
                          <Textarea
                            value={testCase.explanation}
                            onChange={(e) =>
                              handleTestCaseChange(
                                index,
                                "explanation",
                                e.target.value
                              )
                            }
                            placeholder="Explain this test case with markdown support...

Example:
**Explanation:** The array [1, -3, 2, 1, -1] has maximum sum of 3 from subarray [2, 1]."
                            className="h-20 border-2 focus:border-purple-500 transition-all resize-none"
                          />
                        ) : (
                          <div className="h-20 p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                            {testCase.explanation ? (
                              renderMarkdownPreview(testCase.explanation)
                            ) : (
                              <p className="text-muted-foreground italic">
                                No explanation provided yet...
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Submit Section - Only shown in Test Cases tab */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Ready to Create Your Problem?
                    </h3>
                    <p className="text-muted-foreground">
                      Review all sections and click create when you're satisfied
                      with your problem.
                    </p>
                  </div>

                  <Separator className="w-24" />

                  <Button
                    onClick={handleSubmit}
                    className="px-12 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Create Problem
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
