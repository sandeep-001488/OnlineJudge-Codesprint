"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export const ProblemFilters = ({
  searchQuery,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  onClearFilters,
  showClearButton,
}) => {
  return (
    <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search problems by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 h-12 text-base border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-gray-100 rounded-xl"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Select
                value={selectedDifficulty}
                onValueChange={onDifficultyChange}
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

              {showClearButton && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClearFilters}
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
  );
};
