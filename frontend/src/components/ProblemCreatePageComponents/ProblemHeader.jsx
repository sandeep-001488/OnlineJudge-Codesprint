import { Sparkles } from "lucide-react";

export function ProblemHeader() {
  return (
    <>
      {/* Desktop Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-blue-50/90 via-white/90 to-purple-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-purple-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-3 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Create New Problem
            </h1>
            <p className="text-sm text-muted-foreground">
              Design challenging problems for the coding community
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden py-8 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Problem
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Design challenging problems that will inspire and test the coding
            community
          </p>
        </div>
      </div>
    </>
  );
}
