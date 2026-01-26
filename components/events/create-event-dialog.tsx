"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateEventForm } from "./create-event-form";

interface CreateEventDialogProps {
  clubId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({
  clubId,
  open,
  onOpenChange,
}: CreateEventDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details for your event. All fields are required except
            budget information.
          </DialogDescription>
        </DialogHeader>
        <CreateEventForm
          clubId={clubId}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
