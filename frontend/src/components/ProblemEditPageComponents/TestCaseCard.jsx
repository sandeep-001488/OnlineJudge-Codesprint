import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export const TestCaseCard = ({
  testCase,
  index,
  handleTestCaseChange,
  removeTestCase,
  canRemove,
}) => {
  return (
    <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
            Test Case {index + 1}
          </CardTitle>
          {canRemove && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeTestCase(index)}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-green-700 dark:text-green-400">
              Input *
            </Label>
            <Textarea
              value={testCase.input}
              onChange={(e) =>
                handleTestCaseChange(index, "input", e.target.value)
              }
              placeholder="Sample input..."
              className="h-24 font-mono text-sm border-2 focus:border-green-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              Expected Output *
            </Label>
            <Textarea
              value={testCase.expectedOutput}
              onChange={(e) =>
                handleTestCaseChange(index, "expectedOutput", e.target.value)
              }
              placeholder="Expected output..."
              className="h-24 font-mono text-sm border-2 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-purple-700 dark:text-purple-400">
            Explanation (Optional)
          </Label>
          <Textarea
            value={testCase.explanation}
            onChange={(e) =>
              handleTestCaseChange(index, "explanation", e.target.value)
            }
            placeholder="Explain this test case..."
            className="h-20 border-2 focus:border-purple-500 transition-all resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};
