import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import SubmissionItem from "./SubmissionItem";

const RecentSubmissionsCard = ({ recentSubmissions, formatSubmissionTime }) => {
  
  return (
    <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-green-600" />
          <span>Recent Submissions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentSubmissions && recentSubmissions.length > 0 ? (
          <div className="max-h-96 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {recentSubmissions.map((submission, index) => (
              <SubmissionItem
                key={submission._id}
                submission={submission}
                formatSubmissionTime={formatSubmissionTime}
              />
            ))}
           
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No recent submissions
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSubmissionsCard;
