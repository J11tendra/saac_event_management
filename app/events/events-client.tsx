"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Event, fetchEventsForClub } from "@/lib/queries";
import type { Club } from "@/lib/types";
import { EventList } from "@/components/events/event-list";
import { CreateEventDialog } from "@/components/events/create-event-dialog";
import { useClub } from "@/components/providers/club-context";

interface User {
  email?: string;
}

interface Props {
  club: Club;
  initialEvents: Event[];
  user: User;
}

export default function EventsClient({ club, initialEvents }: Props) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { setClub, setCreateEventDialogHandler } = useClub();

  // Use React Query to manage events data
  const { data: events = [] } = useQuery({
    queryKey: ["events", club.id],
    queryFn: () => fetchEventsForClub(club.id) as Promise<Event[]>,
    initialData: initialEvents,
  });

  // Set club info in context and register dialog handler
  useEffect(() => {
    setClub(club);
    setCreateEventDialogHandler(() => setShowCreateDialog(true));

    return () => {
      setClub(null);
    };
  }, [club, setClub, setCreateEventDialogHandler]);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Events</h2>
        </div>

        {/* Events List */}
        <EventList
          events={events}
          clubId={club.id}
          onRefetch={() => {}}
        />

        {/* Create Event Dialog */}
        <CreateEventDialog
          clubId={club.id}
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </main>
    </div>
  );
}
