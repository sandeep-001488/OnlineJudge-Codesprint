import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PreviewToggleButton } from "./PreviewToggleButton";
import { MarkdownPreview } from "./MarkdownPreview";

export function TestCase({
  testCase,
  index,
  totalCases,
  previewModes,
  onChange,
  onRemove,
  onTogglePreview,
}) {
  return (
    <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            Test Case {index + 1}
            {index === 0 && totalCases > 1 && (
              <Badge
                variant="secondary"
                className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                New
              </Badge>
            )}
          </CardTitle>
          {totalCases > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-green-700 dark:text-green-400">
              Input *
            </Label>
            <Textarea
              value={testCase.input}
              onChange={(e) => onChange(index, "input", e.target.value)}
              placeholder="Sample input..."
              className="h-24 font-mono text-sm border-2 focus:border-green-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Expected Output *
            </Label>
            <Textarea
              value={testCase.expectedOutput}
              onChange={(e) =>
                onChange(index, "expectedOutput", e.target.value)
              }
              placeholder="Expected output..."
              className="h-24 font-mono text-sm border-2 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-purple-700 dark:text-purple-400">
              Explanation (Optional)
            </Label>
            <PreviewToggleButton
              field="explanation"
              testCaseIndex={index}
              previewModes={previewModes}
              onToggle={onTogglePreview}
            />
          </div>

          {!previewModes.testCases[index] ? (
            <Textarea
              value={testCase.explanation}
              onChange={(e) => onChange(index, "explanation", e.target.value)}
              placeholder="Explain this test case with markdown support...

Example:
**Explanation:** The array [1, -3, 2, 1, -1] has maximum sum of 3 from subarray [2, 1]."
              className="h-20 border-2 focus:border-purple-500 transition-all resize-none"
            />
          ) : (
            <div className="h-20 p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
              <MarkdownPreview text={testCase.explanation} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
