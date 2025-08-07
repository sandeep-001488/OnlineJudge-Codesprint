"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Clock,
  MemoryStick,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

const getStatusIcon = (status) => {
  switch (status) {
    case "Accepted":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "Wrong Answer":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "Compilation Error":
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    default:
      return <XCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
    case "Wrong Answer":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
    case "Compilation Error":
      return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (timeMs) => {
  if (timeMs < 1000) return `${timeMs}ms`;
  return `${(timeMs / 1000).toFixed(2)}s`;
};

export const SubmissionCodeModal = ({
  isOpen,
  onClose,
  submission,
  onBack,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyCode = async () => {
    if (submission?.code) {
      try {
        await navigator.clipboard.writeText(submission.code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Submission Details
              </DialogTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              className={`transition-colors ${
                isCopied
                  ? "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-500/10"
                  : ""
              }`}
            >
              {isCopied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Submission Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 ${getStatusColor(
                      submission.status
                    )}`}
                  >
                    {getStatusIcon(submission.status)}
                    {submission.status}
                  </Badge>
                  <Badge variant="outline">{submission.language}</Badge>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(submission.createdAt)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Time: {formatTime(submission.time)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MemoryStick className="w-4 h-4" />
                  <span>Memory: {submission.memory}MB</span>
                </div>
              </div>
              {submission.output && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Output:</strong> {submission.output}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Code Display */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Source Code
                </h3>
                <Badge variant="outline" className="text-xs">
                  {submission.language}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto border text-sm font-mono max-h-96 overflow-y-auto">
                  <code className="text-gray-800 dark:text-gray-200 whitespace-pre">
                    {submission.code}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
