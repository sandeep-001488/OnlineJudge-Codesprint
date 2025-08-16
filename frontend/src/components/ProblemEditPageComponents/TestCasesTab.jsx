import { CheckCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { TestCaseCard } from "./TestCaseCard";
import { SubmitSection } from "./SubmitSection";

export const TestCasesTab = ({
  problemData,
  handleTestCaseChange,
  addTestCase,
  removeTestCase,
  hasChanges,
  isSaving,
  onSubmit,
  onGoBack,
}) => {
  return (
    <>
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              Sample Test Cases
            </CardTitle>
            <Button
              onClick={addTestCase}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Test Case
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {problemData.sampleTestCases.map((testCase, index) => (
            <TestCaseCard
              key={index}
              testCase={testCase}
              index={index}
              handleTestCaseChange={handleTestCaseChange}
              removeTestCase={removeTestCase}
              canRemove={problemData.sampleTestCases.length > 1}
            />
          ))}
        </CardContent>
      </Card>
      <SubmitSection
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSubmit={onSubmit}
        onGoBack={onGoBack}
      />
    </>
  );
};
