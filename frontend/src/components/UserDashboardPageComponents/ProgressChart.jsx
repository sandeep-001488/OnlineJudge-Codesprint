import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const ProgressChart = () => {
  return (
    <Card className="mt-8 bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <span>Solving Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Progress chart will be implemented with real data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
