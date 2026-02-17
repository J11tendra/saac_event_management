"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import type { Event } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getMonthData,
  formatDate,
  DAY_NAMES,
} from "@/lib/utils/date-utils";
import { CalendarEventCard } from "./calendar-event-card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MonthlyCalendarProps {
  currentDate: Date;
  events: Event[];
  onEventUpdate?: () => void;
  user?: User;
}

export function MonthlyCalendar({ 
  currentDate, 
  events, 
  onEventUpdate, 
  user,
}: MonthlyCalendarProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const { daysInMonth, startingDayOfWeek } = useMemo(
    () => getMonthData(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate]
  );

  // Group events by date - Normalize date strings
  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();

    events.forEach((event) => {
      event.event_date_preference?.forEach((pref) => {
        const dateStr = pref.date.split('T')[0];
        if (!map.has(dateStr)) {
          map.set(dateStr, []);
        }
        map.get(dateStr)?.push(event);
      });
    });

    return map;
  }, [events]);

  const days = [];
  const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startingDayOfWeek + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

    if (isCurrentMonth) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        dayNumber
      );
      const dateStr = formatDate(date);
      const dayEvents = eventsByDate.get(dateStr) || [];
      const isToday =
        date.toDateString() === new Date().toDateString();

      days.push({
        date,
        dateStr,
        dayNumber,
        isCurrentMonth: true,
        isToday,
        events: dayEvents,
      });
    } else {
      days.push({
        date: null,
        dateStr: null,
        dayNumber: null,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }
  }

  // Close expanded date when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setExpandedDate(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleExpand = (dateStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDate(expandedDate === dateStr ? null : dateStr);
  };

  return (
    <Card className="p-4" ref={calendarRef}>
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {/* Day headers */}
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="bg-muted p-3 text-center text-sm font-semibold"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          const isExpanded = day.dateStr === expandedDate;
          const showMoreButton = day.events.length > 3;

          return (
            <div
              key={index}
              className={cn(
                "bg-background p-2 transition-all",
                !day.isCurrentMonth && "bg-muted/30",
                isExpanded ? "min-h-fit" : "min-h-[120px]"
              )}
            >
              {day.isCurrentMonth && (
                <>
                  <div
                    className={cn(
                      "text-sm font-medium mb-2",
                      day.isToday &&
                        "inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground"
                    )}
                  >
                    {day.dayNumber}
                  </div>
                  <div className="space-y-1">
                    {(isExpanded ? day.events : day.events.slice(0, 3)).map((event, eventIndex) => (
                      <CalendarEventCard
                        key={`${event.id}-${day.date?.toISOString()}-${eventIndex}`}
                        event={event}
                        compact
                        onEventUpdate={onEventUpdate}
                        user={user}
                      />
                    ))}
                    {showMoreButton && (
                      <button
                        onClick={(e) => handleToggleExpand(day.dateStr!, e)}
                        className={cn(
                          "w-full text-xs font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors flex items-center justify-center gap-1",
                          isExpanded 
                            ? "text-primary" 
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3" />
                            Show less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            +{day.events.length - 3} more
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
