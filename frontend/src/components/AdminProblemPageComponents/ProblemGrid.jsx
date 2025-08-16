"use client";
import React from "react";
import { ProblemCard } from "./ProblemCard";

export const ProblemGrid = ({
  problems,
  canManageProblems,
  onCardClick,
  onView,
  onEdit,
  onTestCases,
  onDelete,
  getDifficultyColor,
  formatDate,
  theme,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {problems.map((problem) => (
        <ProblemCard
          key={problem._id}
          problem={problem}
          canManageProblems={canManageProblems}
          onCardClick={onCardClick}
          onView={onView}
          onEdit={onEdit}
          onTestCases={onTestCases}
          onDelete={onDelete}
          getDifficultyColor={getDifficultyColor}
          formatDate={formatDate}
          theme={theme}
        />
      ))}
    </div>
  );
};
