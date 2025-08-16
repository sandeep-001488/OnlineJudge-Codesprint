import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({
  icon: Icon,
  title,
  mainValue,
  subValue,
  color,
  accentText,
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {mainValue}
            </p>
            {subValue && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {subValue}
              </p>
            )}
            {accentText && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {accentText}
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
