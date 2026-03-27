import { formatDate, formatDateLabel } from "@/app/utils/dateUtils";
import Button from "../common/Button";

interface DateSelectorProps {
  dates: Date[];
  selectedDate: string;
  onSelect: (dateStr: string) => void;
}

export default function DateSelector({
  dates,
  selectedDate,
  onSelect,
}: DateSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {dates.map((date, index) => {
        const dateStr = formatDate(date);
        const isSelected = selectedDate === dateStr;
        return (
          <Button
            key={dateStr}
            onClick={() => onSelect(dateStr)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition
                            ${
                              isSelected
                                ? "bg-red-500 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
          >
            {formatDateLabel(date, index)}
          </Button>
        );
      })}
    </div>
  );
}
