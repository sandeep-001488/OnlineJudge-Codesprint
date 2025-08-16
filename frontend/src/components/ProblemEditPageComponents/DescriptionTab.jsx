import React from "react";
import { Code, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DescriptionTab = ({
  problemData,
  onInputChange,
  previewMode,
  setPreviewMode,
  renderMarkdownPreview,
}) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Code className="h-6 w-6 text-purple-600" />
            Problem Description
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 border-2"
          >
            {previewMode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {previewMode ? "Edit" : "Preview"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!previewMode ? (
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

Write your problem description here with markdown support..."
              className="min-h-[400px] font-mono text-sm border-2 focus:border-purple-500 transition-all resize-none"
            />
          </div>
        ) : (
          <div className="min-h-[400px] p-6 rounded-lg border-2 bg-gray-50 dark:bg-gray-900/50 overflow-y-auto">
            {problemData.description ? (
              renderMarkdownPreview(problemData.description)
            ) : (
              <p className="text-muted-foreground italic">
                No description provided yet...
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
