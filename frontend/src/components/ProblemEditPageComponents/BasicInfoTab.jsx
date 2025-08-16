import React from "react";
import { BookOpen, Plus, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DIFFICULTY_CONFIG = {
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

export const BasicInfoTab = ({
  problemData,
  onInputChange,
  currentTag,
  setCurrentTag,
  addTag,
  removeTag,
}) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BookOpen className="h-6 w-6 text-orange-600" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-semibold">
            Problem Title *
          </Label>
          <Input
            id="title"
            value={problemData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="Enter an engaging problem title..."
            className="h-12 text-lg border-2 focus:border-orange-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Difficulty Level *
            </Label>
            <Select
              value={problemData.difficulty}
              onValueChange={(value) => onInputChange("difficulty", value)}
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

          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Selected Difficulty
            </Label>
            <div
              className={`h-12 rounded-lg border-2 flex items-center justify-center ${
                DIFFICULTY_CONFIG[problemData.difficulty]?.bgColor
              } ${DIFFICULTY_CONFIG[problemData.difficulty]?.borderColor}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    DIFFICULTY_CONFIG[problemData.difficulty]?.color
                  }`}
                ></div>
                <span
                  className={`font-semibold capitalize ${
                    DIFFICULTY_CONFIG[problemData.difficulty]?.textColor
                  }`}
                >
                  {problemData.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

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
  );
};
