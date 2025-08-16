"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Eye, EyeOff, TestTube } from "lucide-react";

const TestCaseFilters = ({
  filterType,
  setFilterType,
  counts,
  filteredTestCases,
  testCases,
}) => {
  return (
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
  );
};

export default TestCaseFilters;
