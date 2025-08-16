import { Code, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PreviewToggleButton } from "./PreviewToggleButton";
import { MarkdownPreview } from "./MarkdownPreview";

export function DescriptionTab({
  problemData,
  previewModes,
  onInputChange,
  onTogglePreview,
}) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Code className="h-6 w-6 text-purple-600" />
            Problem Description
          </CardTitle>
          <PreviewToggleButton
            field="description"
            previewModes={previewModes}
            onToggle={onTogglePreview}
          />
        </div>
      </CardHeader>
      <CardContent>
        {!previewModes.description ? (
          <div className="space-y-3">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You can use markdown formatting for better presentation. Use
                **bold**, *italic*, and # headers.
              </AlertDescription>
            </Alert>
            <Textarea
              value={problemData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
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
            <MarkdownPreview text={problemData.description} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
