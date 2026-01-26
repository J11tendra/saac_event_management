"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/lib/types";
import { EventCard } from "./event-card";
import { AddBudgetDialog } from "./add-budget-dialog";
import { EditDatePreferencesDialog } from "./edit-date-preferences-dialog";
import { CommentsDialog } from "./comments-dialog";

interface EventListProps {
  events: Event[];
  clubId: string;
  onRefetch: () => void;
}

export function EventList({ events, clubId }: EventListProps) {
  const [budgetDialogState, setBudgetDialogState] = useState<{
    open: boolean;
    eventId: string;
    eventName: string;
  }>({ open: false, eventId: "", eventName: "" });

  const [dateDialogState, setDateDialogState] = useState<{
    open: boolean;
    eventId: string;
    eventName: string;
    currentPreferences: Event["event_date_preference"];
  }>({
    open: false,
    eventId: "",
    eventName: "",
    currentPreferences: [],
  });

  const [commentsDialogState, setCommentsDialogState] = useState<{
    open: boolean;
    eventId: string;
    eventName: string;
  }>({
    open: false,
    eventId: "",
    eventName: "",
  });

  // Get current comments from the events array (stays in sync with query data)
  const currentCommentsEvent = events.find(
    (e) => e.id === commentsDialogState.eventId,
  );
  const currentComments = currentCommentsEvent?.event_review || [];

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No events yet. Create your first event to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onAddBudget={() =>
              setBudgetDialogState({
                open: true,
                eventId: event.id,
                eventName: event.event_name,
              })
            }
            onEditDatePreferences={() =>
              setDateDialogState({
                open: true,
                eventId: event.id,
                eventName: event.event_name,
                currentPreferences: event.event_date_preference || [],
              })
            }
            onViewComments={() =>
              setCommentsDialogState({
                open: true,
                eventId: event.id,
                eventName: event.event_name,
              })
            }
          />
        ))}
      </div>

      {/* Dialogs */}
      <AddBudgetDialog
        eventId={budgetDialogState.eventId}
        eventName={budgetDialogState.eventName}
        clubId={clubId}
        open={budgetDialogState.open}
        onOpenChange={(open) =>
          setBudgetDialogState({ ...budgetDialogState, open })
        }
      />

      <EditDatePreferencesDialog
        eventId={dateDialogState.eventId}
        eventName={dateDialogState.eventName}
        clubId={clubId}
        currentPreferences={dateDialogState.currentPreferences}
        open={dateDialogState.open}
        onOpenChange={(open) =>
          setDateDialogState({ ...dateDialogState, open })
        }
      />

      <CommentsDialog
        eventId={commentsDialogState.eventId}
        eventName={commentsDialogState.eventName}
        clubId={clubId}
        comments={currentComments}
        open={commentsDialogState.open}
        onOpenChange={(open) =>
          setCommentsDialogState({ ...commentsDialogState, open })
        }
      />
    </>
  );
}
