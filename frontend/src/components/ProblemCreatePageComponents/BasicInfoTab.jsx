import { BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PreviewToggleButton } from "./PreviewToggleButton";
import { MarkdownPreview } from "./MarkdownPreview";
import { DifficultySelector } from "./DifficultySelector";
import { TagManager } from "./TagManager";

export function BasicInfoTab({
  problemData,
  previewModes,
  onInputChange,
  onTogglePreview,
}) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BookOpen className="h-6 w-6 text-blue-600" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="title" className="text-base font-semibold">
              Problem Title *
            </Label>
            <PreviewToggleButton
              field="title"
              previewModes={previewModes}
              onToggle={onTogglePreview}
            />
          </div>

          {!previewModes.title ? (
            <Input
              id="title"
              value={problemData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              placeholder="Enter an engaging problem title..."
              className="h-12 text-lg border-2 focus:border-blue-500 transition-all"
            />
          ) : (
            <div className="h-12 p-3 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 flex items-center">
              <MarkdownPreview text={problemData.title} />
            </div>
          )}
        </div>

        <DifficultySelector
          difficulty={problemData.difficulty}
          onChange={(value) => onInputChange("difficulty", value)}
        />

        <TagManager
          tags={problemData.tags}
          onTagsChange={(tags) => onInputChange("tags", tags)}
        />
      </CardContent>
    </Card>
  );
}
