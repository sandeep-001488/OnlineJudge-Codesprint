export const useTestCases = (problemData, setProblemData) => {
  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = problemData.sampleTestCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setProblemData((prev) => ({
      ...prev,
      sampleTestCases: updatedTestCases,
    }));
  };

  const addTestCase = () => {
    setProblemData((prev) => ({
      ...prev,
      sampleTestCases: [
        { input: "", expectedOutput: "", explanation: "" },
        ...prev.sampleTestCases,
      ],
    }));
  };

  const removeTestCase = (index) => {
    if (problemData.sampleTestCases.length > 1) {
      setProblemData((prev) => ({
        ...prev,
        sampleTestCases: prev.sampleTestCases.filter((_, i) => i !== index),
      }));
    }
  };

  return {
    handleTestCaseChange,
    addTestCase,
    removeTestCase,
  };
};
