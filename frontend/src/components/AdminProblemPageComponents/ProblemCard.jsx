"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Tag,
  TestTube,
} from "lucide-react";

export const ProblemCard = ({
  problem,
  canManageProblems,
  onCardClick,
  onView,
  onEdit,
  onTestCases,
  onDelete,
  getDifficultyColor,
  formatDate,
  theme,
}) => {
  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 hover:-translate-y-1 cursor-pointer"
      onClick={() => onCardClick(problem)}
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
                    onView(problem);
                  }}
                  className="dark:hover:bg-gray-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(problem);
                  }}
                  className="dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onTestCases(problem);
                  }}
                  className="dark:hover:bg-gray-700"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Cases
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(problem);
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
  );
};
