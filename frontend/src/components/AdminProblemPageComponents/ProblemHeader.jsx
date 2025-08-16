"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ProblemHeader = ({ canManageProblems, onCreateClick }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Coding Problems
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Challenge yourself with our curated collection of coding problems
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canManageProblems && (
            <Button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Problem
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
