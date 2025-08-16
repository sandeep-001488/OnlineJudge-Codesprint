"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

const TestCaseHeader = ({ currentProblem, onCreateClick }) => {
  const router = useRouter();

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
              <Badge className={getDifficultyColor(currentProblem?.difficulty)}>
                {currentProblem?.difficulty}
              </Badge>
            </div>
          </div>

          <Button
            onClick={onCreateClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Test Case
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestCaseHeader;
