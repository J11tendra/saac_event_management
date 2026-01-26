"use client";

import { useState } from "react";
import { type Event } from "@/lib/queries";
import { EventList } from "@/components/events/event-list";
import { CreateEventForm } from "@/components/events/create-event-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Club {
  id: string;
  club_name: string;
  club_email: string;
}

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

  // Expose club info and create dialog handler to window for layout/sidebar access
  React.useEffect(() => {
    (
      window as Window &
        typeof globalThis & {
          __clubInfo?: { name: string; email: string };
          __openCreateEventDialog?: () => void;
        }
    ).__clubInfo = {
      name: club.club_name,
      email: club.club_email,
    };
    (
      window as Window &
        typeof globalThis & {
          __clubInfo?: { name: string; email: string };
          __openCreateEventDialog?: () => void;
        }
    ).__openCreateEventDialog = () => setShowCreateDialog(true);

    return () => {
      delete (
        window as Window &
          typeof globalThis & {
            __clubInfo?: { name: string; email: string };
            __openCreateEventDialog?: () => void;
          }
      ).__clubInfo;
      delete (
        window as Window &
          typeof globalThis & {
            __clubInfo?: { name: string; email: string };
            __openCreateEventDialog?: () => void;
          }
      ).__openCreateEventDialog;
    };
  }, [club.club_name, club.club_email]);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Events</h2>
        </div>

        {/* Events List */}
        <EventList
          events={initialEvents}
          clubId={club.id}
          onRefetch={() => window.location.reload()}
        />

        {/* Create Event Dialog */}
        <Dialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details for your event. All fields are required
                except budget information.
              </DialogDescription>
            </DialogHeader>
            <CreateEventForm
              clubId={club.id}
              onSuccess={() => setShowCreateDialog(false)}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

// Import React for useEffect
import * as React from "react";
