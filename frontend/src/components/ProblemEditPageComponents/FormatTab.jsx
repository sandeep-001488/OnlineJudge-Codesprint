import React from "react";
import { Target, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const FormatTab = ({ problemData, onInputChange }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Format */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-5 w-5 text-green-600" />
              Input Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={problemData.inputFormat}
              onChange={(e) => onInputChange("inputFormat", e.target.value)}
              placeholder="Describe the input format..."
              className="min-h-[200px] border-2 focus:border-green-500 transition-all resize-none"
            />
          </CardContent>
        </Card>

        {/* Output Format */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-5 w-5 text-orange-600" />
              Output Format
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={problemData.outputFormat}
              onChange={(e) => onInputChange("outputFormat", e.target.value)}
              placeholder="Describe the output format..."
              className="min-h-[200px] border-2 focus:border-orange-500 transition-all resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Constraints */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Constraints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={problemData.constraints}
            onChange={(e) => onInputChange("constraints", e.target.value)}
            placeholder="Define the problem constraints..."
            className="min-h-[150px] border-2 focus:border-red-500 transition-all resize-none"
          />
        </CardContent>
      </Card>
    </>
  );
};
