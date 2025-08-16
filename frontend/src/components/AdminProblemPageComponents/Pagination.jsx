"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ pagination, onPageChange, disabled = false }) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <Button
        variant="outline"
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page <= 1 || disabled}
        className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Prev
      </Button>
      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
        Page {pagination.page} of {pagination.pages}
      </div>
      <Button
        variant="outline"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page >= pagination.pages || disabled}
        className="border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};
