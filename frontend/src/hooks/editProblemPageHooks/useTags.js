import { useState } from "react";

export const useTags = (problemData, setProblemData) => {
  const [currentTag, setCurrentTag] = useState("");

  const addTag = () => {
    if (
      currentTag.trim() &&
      !problemData.tags.includes(currentTag.trim().toLowerCase())
    ) {
      setProblemData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setProblemData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return {
    currentTag,
    setCurrentTag,
    addTag,
    removeTag,
  };
};
