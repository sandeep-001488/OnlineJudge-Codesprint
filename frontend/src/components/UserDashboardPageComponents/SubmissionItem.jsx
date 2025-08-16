import React from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const SubmissionItem = ({ submission, formatSubmissionTime }) => {
  const router = useRouter();
  const slugify = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg ">
      <div
        className="cursor-pointer "
        onClick={() =>
          router.push(
            `/problems/${slugify(submission.problem?.title)}-${
              submission.problem?._id
            }`
          )
        }
      >
        <p className="font-medium text-gray-900 dark:text-white hover:dark:text-teal-500 hover:text-red-500">
          {submission.problem?.title || "Unknown Problem"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatSubmissionTime(submission.createdAt)}
        </p>
      </div>
      <Badge
        variant={submission.status === "Accepted" ? "default" : "destructive"}
        className={
          submission.status === "Accepted"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }
      >
        {submission.status}
      </Badge>
    </div>
  );
};

export default SubmissionItem;
