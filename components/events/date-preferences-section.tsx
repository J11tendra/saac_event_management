"use client";

import { Calendar, Clock, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import type { EventDatePreference } from "@/lib/types";

interface DatePreferencesSectionProps {
  datePreferences: EventDatePreference[];
  acceptedDatePreferenceId: string | null;
}

export function DatePreferencesSection({
  datePreferences,
  acceptedDatePreferenceId,
}: DatePreferencesSectionProps) {
  const acceptedPref = datePreferences.find(
    (p) => p.id === acceptedDatePreferenceId,
  );

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between p-2 h-auto"
        >
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">
              {acceptedPref ?
                <>
                  {new Date(acceptedPref.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  • {acceptedPref.start_time} - {acceptedPref.end_time}
                </>
              : `Date Preferences (${datePreferences.length})`}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 space-y-2">
        {datePreferences.map((pref) => (
          <DatePreferenceItem
            key={pref.id}
            preference={pref}
            isAccepted={acceptedDatePreferenceId === pref.id}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface DatePreferenceItemProps {
  preference: EventDatePreference;
  isAccepted: boolean;
}

function DatePreferenceItem({
  preference,
  isAccepted,
}: DatePreferenceItemProps) {
  return (
    <div
      className={`text-sm p-3 rounded-md ${
        isAccepted ? "bg-chart-2/10 border border-chart-2/30" : "bg-muted/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="w-3 h-3" />
            {new Date(preference.date).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3 h-3" />
            {preference.start_time} - {preference.end_time}
          </div>
        </div>
        {isAccepted && (
          <span className="text-chart-2 font-semibold text-xs whitespace-nowrap">
            ✓ Accepted
          </span>
        )}
      </div>
    </div>
  );
}
