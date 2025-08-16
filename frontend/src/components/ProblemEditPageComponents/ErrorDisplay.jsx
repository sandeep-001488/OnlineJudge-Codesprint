import React from "react";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ErrorDisplay = ({ error, onRetry, onGoBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 max-w-md">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Error Loading Problem
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex gap-3">
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
            <Button onClick={onGoBack}>Go Back</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
