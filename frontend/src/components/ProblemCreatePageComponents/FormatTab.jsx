import { Target, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownPreview } from "./MarkdownPreview";
import { PreviewToggleButton } from "./PreviewToggleButton";


export function FormatTab({
  problemData,
  previewModes,
  onInputChange,
  onTogglePreview,
}) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-green-600" />
                Input Format
              </CardTitle>
              <PreviewToggleButton
                field="inputFormat"
                previewModes={previewModes}
                onToggle={onTogglePreview}
              />
            </div>
          </CardHeader>
          <CardContent>
            {!previewModes.inputFormat ? (
              <Textarea
                value={problemData.inputFormat}
                onChange={(e) => onInputChange("inputFormat", e.target.value)}
                placeholder="Describe the input format...

Example:
- First line contains integer N (number of elements)
- Second line contains N space-separated integers"
                className="min-h-[200px] border-2 focus:border-green-500 transition-all resize-none"
              />
            ) : (
              <div className="min-h-[200px] p-4 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                <MarkdownPreview text={problemData.inputFormat} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5 text-orange-600" />
                Output Format
              </CardTitle>
              <PreviewToggleButton
                field="outputFormat"
                previewModes={previewModes}
                onToggle={onTogglePreview}
              />
            </div>
          </CardHeader>
          <CardContent>
            {!previewModes.outputFormat ? (
              <Textarea
                value={problemData.outputFormat}
                onChange={(e) => onInputChange("outputFormat", e.target.value)}
                placeholder="Describe the output format...

Example:
- Single integer representing the maximum sum"
                className="min-h-[200px] border-2 focus:border-orange-500 transition-all resize-none"
              />
            ) : (
              <div className="min-h-[200px] p-4 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
                <MarkdownPreview text={problemData.outputFormat} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Constraints
            </CardTitle>
            <PreviewToggleButton
              field="constraints"
              previewModes={previewModes}
              onToggle={onTogglePreview}
            />
          </div>
        </CardHeader>
        <CardContent>
          {!previewModes.constraints ? (
            <Textarea
              value={problemData.constraints}
              onChange={(e) => onInputChange("constraints", e.target.value)}
              placeholder="Define the problem constraints...

Example:
- 1 ≤ N ≤ 10^5
- -10^9 ≤ arr[i] ≤ 10^9
- Time Limit: 1 second
- Memory Limit: 256 MB"
              className="min-h-[150px] border-2 focus:border-red-500 transition-all resize-none"
            />
          ) : (
            <div className="min-h-[150px] p-4 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
              <MarkdownPreview text={problemData.constraints} />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
