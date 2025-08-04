// "use client"
// import { Play, Loader2, Send } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export const ActionButtons = ({ isRunning, onRunCode, onSubmit }) => {
//   return (
//     <div className="flex gap-3">
//       <Button
//         onClick={onRunCode}
//         disabled={isRunning}
//         className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-3 text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//         size="lg"
//       >
//         {isRunning ? (
//           <>
//             <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//             Awaiting..
//           </>
//         ) : (
//           <>
//             <Play className="w-5 h-5 mr-2" />
//             Run Code
//           </>
//         )}
//       </Button>

//       <Button
//         onClick={onSubmit}
//         disabled={isRunning}
//         variant="outline"
//         className="px-6 py-3 text-base font-medium border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-400 dark:hover:text-white"
//         size="lg"
//       >
//         <Send className="w-5 h-5 mr-2" />
//         Submit
//       </Button>
//     </div>
//   );
// };
"use client";
import { Play, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ActionButtons = ({
  isRunning,
  isSubmitting,
  onRunCode,
  onSubmit,
}) => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onRunCode}
        disabled={isRunning || isSubmitting}
        className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-3 text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {isRunning ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Awaiting..
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Run Code
          </>
        )}
      </Button>

      <Button
        onClick={onSubmit}
        disabled={isRunning || isSubmitting}
        variant="outline"
        className="px-6 py-3 text-base font-medium border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-400 dark:hover:text-white"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting..
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Submit
          </>
        )}
      </Button>
    </div>
  );
};