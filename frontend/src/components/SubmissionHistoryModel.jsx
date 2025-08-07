"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  MemoryStick,
  Code,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

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
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (timeMs) => {
  if (timeMs < 1000) return `${timeMs}ms`;
  return `${(timeMs / 1000).toFixed(2)}s`;
};

export const SubmissionHistoryModal = ({
  isOpen,
  onClose,
  submissions = [],
  onViewCode,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Submission History ({submissions.length})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No submissions found
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission, index) => (
                <Card
                  key={submission._id}
                  className="hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between mb-3 gap-y-1">
                      <div className="flex flex-wrap  items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          #{submissions.length - index}
                        </span>
                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1 ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {getStatusIcon(submission.status)}
                          {submission.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {submission.language}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(submission.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap  items-center justify-between gap-y-1">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(submission.time)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MemoryStick className="w-3 h-3" />
                          <span>{submission.memory}MB</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewCode(submission)}
                        className="text-xs"
                      >
                        <Code className="w-3 h-3 mr-1" />
                        View Code
                      </Button>
                    </div>

                    {submission.output && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                        {submission.output}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
