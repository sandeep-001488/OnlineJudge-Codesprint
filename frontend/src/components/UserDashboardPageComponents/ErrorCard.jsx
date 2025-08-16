import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ErrorCard = ({ error, onRetry, onGoHome }) => {
  const isUserNotFound = error === "User not found";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isUserNotFound ? "User Not Found" : "Error"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isUserNotFound
              ? "The user you're looking for doesn't exist."
              : "Failed to load user data. Please try again."}
          </p>
          <div className="space-x-2">
            <Button onClick={onGoHome}>Go Home</Button>
            {!isUserNotFound && (
              <Button variant="outline" onClick={onRetry}>
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorCard;
