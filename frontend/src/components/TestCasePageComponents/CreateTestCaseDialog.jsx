"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TestCaseForm from "./TestCaseForm";

const CreateTestCaseDialog = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col dark:bg-gray-800 dark:border-gray-600">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="dark:text-gray-100">
            Create New Test Case
          </DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Add a new test case for this problem. Make sure the input and output
            are correct.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <TestCaseForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTestCaseDialog;
