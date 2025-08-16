import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const difficultyConfig = {
  easy: {
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  medium: {
    color: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  hard: {
    color: "bg-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

export function DifficultySelector({ difficulty, onChange }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="text-base font-semibold">Difficulty Level *</Label>
        <Select value={difficulty} onValueChange={onChange}>
          <SelectTrigger className="h-12 border-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                Easy
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                Medium
              </div>
            </SelectItem>
            <SelectItem value="hard">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                Hard
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Selected Difficulty</Label>
        <div
          className={`h-12 rounded-lg border-2 flex items-center justify-center ${difficultyConfig[difficulty].bgColor} ${difficultyConfig[difficulty].borderColor}`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${difficultyConfig[difficulty].color}`}
            ></div>
            <span
              className={`font-semibold capitalize ${difficultyConfig[difficulty].textColor}`}
            >
              {difficulty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
