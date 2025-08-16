import { useState } from "react";

export const useUI = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  return {
    previewMode,
    setPreviewMode,
    activeTab,
    setActiveTab,
  };
};
