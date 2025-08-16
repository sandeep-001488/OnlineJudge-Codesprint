import { useState } from "react";

export const useUIState = () => {
  const [showInput, setShowInput] = useState(false);

  return {
    showInput,
    setShowInput,
  };
};
