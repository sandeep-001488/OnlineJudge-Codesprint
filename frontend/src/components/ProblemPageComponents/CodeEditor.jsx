"use client";
import {
  Copy,
  Download,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  History,
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

export const CodeEditor = ({
  selectedLanguage,
  languages,
  code,
  error,
  isCopied,
  editorRef,
  onLanguageChange,
  onCopyCode,
  onDownloadCode,
  onResetCode,
  submissions = [],
  onViewSubmissions,
}) => {
  const hasSubmissions = submissions && submissions.length > 0;

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="hidden sm:flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            <div className="flex items-center gap-5">
              <CardTitle className="text-gray-900 dark:text-white font-semibold">
                Code Editor
              </CardTitle>
              {hasSubmissions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewSubmissions}
                  className="hidden md:flex h-6 px-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                >
                  <History className="w-3 h-3 mr-1" />
                  {submissions.length}
                </Button>
              )}
            </div>
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

        {hasSubmissions && (
          <div className="md:hidden mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewSubmissions}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
            >
              <History className="w-3 h-3 mr-1" />
              {submissions.length}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          <div
            ref={editorRef}
            className="min-h-[400px] lg:min-h-[500px] text-sm font-mono border-0 focus:outline-none [&_.cm-editor]:min-h-[400px] lg:[&_.cm-editor]:min-h-[500px] [&_.cm-content]:p-4 [&_.cm-focused]:outline-none [&_.cm-editor]:bg-transparent"
          />
        </div>
      </CardContent>
    </Card>
  );
};
