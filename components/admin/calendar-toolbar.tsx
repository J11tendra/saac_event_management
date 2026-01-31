"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "@/lib/utils/date-utils";

interface CalendarToolbarProps {
  view: "month" | "week";
  onViewChange: (view: "month" | "week") => void;
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarToolbar({
  view,
  onViewChange,
  currentDate,
  onPrevious,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  const getDateLabel = () => {
    if (view === "month") {
      return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      if (start.getMonth() === end.getMonth()) {
        return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
      } else {
        return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} - ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Button onClick={onToday} variant="outline">
          Today
        </Button>
        <Button onClick={onPrevious} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button onClick={onNext} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold ml-4">{getDateLabel()}</span>
      </div>

      <Select
        value={view}
        onValueChange={(value) => onViewChange(value as "month" | "week")}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="week">Week</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
