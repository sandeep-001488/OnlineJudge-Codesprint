import { Plus, CheckCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TestCase } from "./TestCase";


export function TestCasesTab({
  problemData,
  previewModes,
  onTestCaseChange,
  onAddTestCase,
  onRemoveTestCase,
  onTogglePreview,
  onSubmit,
}) {
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
              onClick={onAddTestCase}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Test Case
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {problemData.sampleTestCases.map((testCase, index) => (
            <TestCase
              key={index}
              testCase={testCase}
              index={index}
              totalCases={problemData.sampleTestCases.length}
              previewModes={previewModes}
              onChange={onTestCaseChange}
              onRemove={onRemoveTestCase}
              onTogglePreview={onTogglePreview}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Ready to Create Your Problem?
              </h3>
              <p className="text-muted-foreground">
                Review all sections and click create when you're satisfied with
                your problem.
              </p>
            </div>

            <Separator className="w-24" />

            <Button
              onClick={onSubmit}
              className="px-12 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Save className="h-5 w-5 mr-2" />
              Create Problem
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
