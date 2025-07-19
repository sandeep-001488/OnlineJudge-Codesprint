"use client";
import React, { useEffect, useState } from "react";
import { Play, Code, Loader2, Terminal, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const CodeCompilerPage = () => {
  const router = useRouter();
  const { isInitialized, isLoggedIn, authHydrated, checkAuth } = useAuthStore();

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
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState(`#include<iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const languages = [
    {
      value: "cpp",
      label: "C++",
      template: `#include<iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
    },
    { value: "python", label: "Python", template: `print("Hello World!")` },
    {
      value: "java",
      label: "Java",
      template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
    },
    {
      value: "javascript",
      label: "JavaScript",
      template: `console.log("Hello World!");`,
    },
  ];

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    const template = languages.find((l) => l.value === lang)?.template || "";
    setCode(template);
    setShowOutput(false);
  };

  const runCode = async () => {
    setIsRunning(true);
    setShowOutput(true);
    setOutput("Running...");

    try {
      const response = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: selectedLanguage,
          code: code,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setOutput(result.output || "Code executed successfully with no output");
      } else {
        setOutput(`Error: ${result.error || "Failed to execute code"}`);
      }
    } catch (error) {
      setOutput(`Network Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-8 pt-8">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Online Code Compiler
        </h2>
        <p className="text-gray-600 dark:text-slate-400 text-lg">
          Test your code in multiple programming languages with real-time
          execution
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Multi-language
          </Badge>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Error handling
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Code Editor */}
        <Card className="bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <CardTitle className="text-gray-900 dark:text-white">
                  Code Editor
                </CardTitle>
              </div>
              <Select
                value={selectedLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-32 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600">
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.value}
                      value={lang.value}
                      className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-slate-700"
                    >
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-96 font-mono text-sm bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your code here..."
              spellCheck={false}
            />

            <Button
              onClick={runCode}
              disabled={isRunning}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-3 transition-all duration-200"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Run Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right Panel - Output or Instructions */}
        {showOutput ? (
          <Card className="bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <Terminal className="w-5 h-5 text-green-500 dark:text-green-400" />
                <CardTitle className="text-gray-900 dark:text-white">
                  Output
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <div className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-600 rounded-lg p-4 min-h-96 overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap text-green-600 dark:text-green-400">
                  {output}
                </pre>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 backdrop-blur-sm shadow-lg">
            <CardContent className="flex items-center justify-center min-h-96">
              <div className="text-center text-gray-500 dark:text-slate-400">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                  <Code className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-300" />
                </div>

                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Ready to Code!
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-slate-400 mb-6 text-lg">
                  Select your language, write your code, and click "Run Code" to
                  see the output here.
                </CardDescription>

                <div className="space-y-2">
                  <Separator className="bg-gray-200 dark:bg-slate-700" />
                  <div className="grid grid-cols-1 gap-2 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Multiple language support
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Real-time compilation
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Comprehensive error handling
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CodeCompilerPage;
