import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreviewToggleButton({
  field,
  testCaseIndex = null,
  previewModes,
  onToggle,
}) {
  const isPreview =
    testCaseIndex !== null
      ? previewModes.testCases[testCaseIndex]
      : previewModes[field];

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onToggle(field, testCaseIndex)}
      className="flex items-center gap-2 border-2"
    >
      {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      {isPreview ? "Edit" : "Preview"}
    </Button>
  );
}
