import { AlertCircle, Loader2, Save } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export const SubmitSection = ({ hasChanges, isSaving, onSubmit, onGoBack }) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Ready to Update Your Problem?
            </h3>
            <p className="text-muted-foreground">
              Review all changes and click update to save your modifications.
            </p>
          </div>

          <Separator className="w-24" />

          {hasChanges && (
            <Alert className="max-w-md bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                You have unsaved changes that will be lost if you navigate away.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              onClick={onGoBack}
              variant="outline"
              className="px-8 py-6 text-lg border-2"
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button
              onClick={onSubmit}
              disabled={isSaving || !hasChanges}
              className="px-12 py-6 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Update Problem
                </>
              )}
            </Button>
          </div>

          {!hasChanges && (
            <p className="text-sm text-muted-foreground">
              No changes detected. Make some modifications to enable the update
              button.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
