"use client"
import {
  Copy,
  Download,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getErrorIcon = (errorType) => {
  switch (errorType) {
    case "compilation":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "runtime":
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-red-500" />;
  }
};

const getErrorBadgeColor = (errorType) => {
  switch (errorType) {
    case "compilation":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
    case "runtime":
      return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20";
    default:
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
  }
};

export const CodeEditor = ({
  selectedLanguage,
  languages,
  code,
  error,
  errorLine,
  isCopied,
  editorRef,
  onLanguageChange,
  onCopyCode,
  onDownloadCode,
  onResetCode,
}) => {
  const currentLanguage = languages.find(
    (lang) => lang.value === selectedLanguage
  );

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="hidden sm:flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <CardTitle className="text-gray-900 dark:text-white font-semibold">
              Code Editor
            </CardTitle>
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              {currentLanguage?.version}
            </Badge>
            {error && errorLine && (
              <Badge
                variant="outline"
                className={`text-xs flex items-center gap-1 ${getErrorBadgeColor(
                  error.type
                )} hidden lg:inline-flex`}
              >
                {getErrorIcon(error.type)}
                Error on Line {errorLine}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-24 sm:w-36 border-2 border-pink-500 bg-gray-50 dark:bg-slate-800 dark:border-slate-600 text-pink-500 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600">
                {languages.map((lang) => (
                  <SelectItem
                    key={lang.value}
                    value={lang.value}
                    className="text-gray-900 dark:text-white focus:bg-gray-100 dark:focus:bg-slate-700"
                  >
                    <div className="flex flex-col">
                      <span className="text-pink-500 dark:text-white">
                        {lang.label}
                      </span>
                      <span className="text-xs text-green-500 hidden sm:block">
                        {lang.version}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopyCode}
                className={`h-8 w-8 p-0 transition-colors ${
                  isCopied
                    ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-500/10"
                    : ""
                }`}
                title={isCopied ? "Copied!" : "Copy code"}
              >
                {isCopied ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDownloadCode}
                className="h-8 w-8 p-0"
                title="Download code"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetCode}
                className="h-8 w-8 p-0"
                title="Reset code"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Show error badge on mobile */}
        {error && errorLine && (
          <Badge
            variant="outline"
            className={`text-xs flex items-center gap-1 ${getErrorBadgeColor(
              error.type
            )} lg:hidden w-fit mt-2`}
          >
            {getErrorIcon(error.type)}
            Error on Line {errorLine}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          <div
            ref={editorRef}
            className="min-h-[400px] lg:min-h-[500px] text-sm font-mono border-0 focus:outline-none [&_.cm-editor]:min-h-[400px] lg:[&_.cm-editor]:min-h-[500px] [&_.cm-content]:p-4 [&_.cm-focused]:outline-none [&_.cm-editor]:bg-transparent"
          />
          {error && errorLine && (
            <div className="flex items-center space-x-2 text-red-500 mt-2">
              {getErrorIcon(error.type)}
              <span>
                Line {errorLine}: {error.type} error
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
