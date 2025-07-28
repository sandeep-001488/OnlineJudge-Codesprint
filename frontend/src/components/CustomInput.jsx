"use client"
import { Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const CustomInput = ({
  customInput,
  showInput,
  onInputChange,
  onToggleInput,
}) => {
  return (
    <Card className="mt-4 bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-xl">
      <CardHeader className="pb-3 cursor-pointer" onClick={onToggleInput}>
        <div className="flex items-center gap-2">
          <Terminal
            className={`w-4 h-4 text-blue-500 transition-transform ${
              showInput ? "rotate-90" : ""
            }`}
          />
          <CardTitle className="text-sm text-gray-900 dark:text-white">
            Custom Input
          </CardTitle>
        </div>
      </CardHeader>
      {showInput && (
        <CardContent>
          <Textarea
            value={customInput}
            onChange={(e) => onInputChange(e.target.value)}
            className="h-24 font-mono text-sm bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter input for your program (optional)..."
            spellCheck={false}
          />
        </CardContent>
      )}
    </Card>
  );
};
