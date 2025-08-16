import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";

const StrongTopicsCard = ({ tags }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-blue-600" />
          <span>Strong Topics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
              </Badge>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No solved problems yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrongTopicsCard;
