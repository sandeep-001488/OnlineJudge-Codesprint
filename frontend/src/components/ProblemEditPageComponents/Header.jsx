import React from "react";
import { ArrowLeft, Settings, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Header = ({ hasChanges, onGoBack }) => {
  return (
    <>
      {/* Desktop Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-blue-50/90 via-white/90 to-purple-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-purple-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={onGoBack}
              variant="outline"
              className="flex items-center gap-2 border-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Problems
            </Button>

            <div className="text-center flex-1 mx-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl mb-3 shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                Edit Problem
              </h1>
              <p className="text-sm text-muted-foreground">
                Modify and improve your coding problem
              </p>
            </div>

            {hasChanges && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden py-8 px-4">
        <Button
          onClick={onGoBack}
          variant="outline"
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl mb-4 shadow-lg">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Edit Problem
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Modify and improve your coding problem
          </p>

          {hasChanges && (
            <Alert className="max-w-sm mx-auto bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
};
