import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const StatusMessage = ({ success, error }) => {
  if (!success && !error) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
        success
          ? "bg-green-500/20 border border-green-500/30 text-green-400"
          : "bg-red-500/20 border border-red-500/30 text-red-400"
      }`}
    >
      {success ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <AlertCircle className="h-5 w-5" />
      )}
      <span>{success || error}</span>
    </div>
  );
};

export default StatusMessage;
