import React from "react";
import { BookOpen, FileText, Settings, CheckCircle } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabNavigation = () => {
  return (
    <>
      <div className="sticky top-[165px] z-40 mb-8 hidden md:block">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-lg rounded-xl">
          <TabsTrigger
            value="basic"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4" />
            Description
          </TabsTrigger>
          <TabsTrigger
            value="format"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4" />
            I/O Format
          </TabsTrigger>
          <TabsTrigger
            value="testcases"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <CheckCircle className="h-4 w-4" />
            Test Cases
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="md:hidden mb-8">
        <TabsList className="flex flex-col h-auto w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 shadow-lg rounded-xl p-2 space-y-2">
          <TabsTrigger
            value="basic"
            className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <BookOpen className="h-5 w-5" />
            Basic Information
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <FileText className="h-5 w-5" />
            Description
          </TabsTrigger>
          <TabsTrigger
            value="format"
            className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <Settings className="h-5 w-5" />
            Input/Output Format
          </TabsTrigger>
          <TabsTrigger
            value="testcases"
            className="w-full justify-start gap-3 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <CheckCircle className="h-5 w-5" />
            Sample Test Cases
          </TabsTrigger>
        </TabsList>
      </div>
    </>
  );
};
