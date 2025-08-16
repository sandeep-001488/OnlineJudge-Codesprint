"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Eye, EyeOff, Save, X } from "lucide-react";

const TestCaseCard = ({
  testCase,
  index,
  isEditing,
  formData,
  setFormData,
  onStartEditing,
  onCancelEditing,
  onUpdateSubmit,
  onDelete,
  isLoading,
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 flex flex-col">
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
              onClick={() => onStartEditing(testCase)}
              disabled={isEditing}
              className="h-8 w-8 p-0 dark:hover:bg-gray-700"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(testCase)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {isEditing ? (
          <form
            onSubmit={onUpdateSubmit}
            className="space-y-3 flex-1 flex flex-col"
          >
            <div className="flex-1">
              <Label
                htmlFor={`edit-input-${testCase._id}`}
                className="text-sm dark:text-gray-200"
              >
                Input
              </Label>
              <Textarea
                id={`edit-input-${testCase._id}`}
                value={formData.input}
                onChange={(e) =>
                  setFormData({ ...formData, input: e.target.value })
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
              <Textarea
                id={`edit-output-${testCase._id}`}
                value={formData.expectedOutput}
                onChange={(e) =>
                  setFormData({ ...formData, expectedOutput: e.target.value })
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
                onClick={onCancelEditing}
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
  );
};

export default TestCaseCard;
