import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <div className="hidden md:block text-center mb-8">
      <div className=" flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 px-3 py-1"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Multi-language Support
        </Badge>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 px-3 py-1"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Syntax highlighting
        </Badge>
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 px-3 py-1"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Real-time Compilation
        </Badge>
      </div>
    </div>
  );
};
