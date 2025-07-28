"use client";
import { Terminal, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const OutputPanel = ({
  isRunning,
  output,
  customInput = "",
  executionTime,
}) => {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-gray-900 dark:text-white font-semibold">
              Custom Output
            </CardTitle>
          </div>

          {/* Execution Time Badge */}
          {executionTime && !isRunning && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              {executionTime}ms
            </Badge>
          )}

          {isRunning && (
            <Badge
              variant="outline"
              className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20 animate-pulse"
            >
              Running...
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {!customInput.trim() && !isRunning ? (
          <div className="text-center py-8 text-gray-500 dark:text-slate-400">
            <Terminal className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Add custom input and run code to see output here
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-slate-950 rounded-lg p-4 min-h-[100px] border border-gray-200 dark:border-slate-700">
            <pre className="text-sm font-mono whitespace-pre-wrap text-green-600 dark:text-green-400">
              {isRunning ? "Executing with custom input..." : output}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};