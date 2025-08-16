"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const TestCaseForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isLoading,
  isEditing = false,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="input" className="dark:text-gray-200">
          Input
        </Label>
        <Textarea
          id="input"
          placeholder="Enter test case input..."
          value={formData.input}
          onChange={(e) => setFormData({ ...formData, input: e.target.value })}
          className="w-full min-h-24 max-h-40 font-mono text-sm p-3 border border-gray-300 rounded-md 
           dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
           resize-y break-all"
          required
        />
      </div>

      <div>
        <Label htmlFor="expectedOutput" className="dark:text-gray-200">
          Expected Output
        </Label>
        <Textarea
          id="expectedOutput"
          placeholder="Enter expected output..."
          value={formData.expectedOutput}
          onChange={(e) =>
            setFormData({ ...formData, expectedOutput: e.target.value })
          }
          className="w-full min-h-24 max-h-40 font-mono text-sm p-3 border border-gray-300 rounded-md 
           dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
           resize-y break-all"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isPublic"
          checked={formData.isPublic}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isPublic: checked })
          }
        />
        <Label htmlFor="isPublic" className="text-sm dark:text-gray-200">
          Make this test case public (visible to users)
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 mt-4 -mx-1 px-1">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Test Case"
            : "Create Test Case"}
        </Button>
      </div>
    </form>
  );
};

export default TestCaseForm;
