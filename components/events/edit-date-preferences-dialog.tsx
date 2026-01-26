"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDatePreferences, type EventDatePreference } from "@/lib/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface EditDatePreferencesDialogProps {
  eventId: string;
  eventName: string;
  clubId: string;
  currentPreferences: EventDatePreference[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DatePreference {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export function EditDatePreferencesDialog({
  eventId,
  eventName,
  clubId,
  currentPreferences,
  open,
  onOpenChange,
}: EditDatePreferencesDialogProps) {
  const [preferences, setPreferences] = useState<DatePreference[]>([]);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  // Initialize preferences when dialog opens
  useEffect(() => {
    if (!open) return;

    // Use a timeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      const initialPreferences =
        currentPreferences.length > 0
          ? currentPreferences.map((pref) => ({
              id: pref.id,
              date: pref.date,
              startTime: pref.start_time,
              endTime: pref.end_time,
            }))
          : [
              {
                id: crypto.randomUUID(),
                date: "",
                startTime: "",
                endTime: "",
              },
            ];

      setPreferences(initialPreferences);
    }, 0);

    return () => clearTimeout(timer);
  }, [open, currentPreferences]);

  const mutation = useMutation({
    mutationFn: updateDatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", clubId] });
      setError("");
      onOpenChange(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to update date preferences");
    },
  });

  const addPreference = () => {
    setPreferences([
      ...preferences,
      {
        id: crypto.randomUUID(),
        date: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const removePreference = (id: string) => {
    if (preferences.length > 1) {
      setPreferences(preferences.filter((p) => p.id !== id));
    }
  };

  const updatePreference = (
    id: string,
    field: "date" | "startTime" | "endTime",
    value: string
  ) => {
    setPreferences(
      preferences.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all preferences
    const validPreferences = preferences.filter(
      (p) => p.date && p.startTime && p.endTime
    );

    if (validPreferences.length === 0) {
      setError("Please add at least one complete date preference");
      return;
    }

    // Check for time validation
    for (const pref of validPreferences) {
      if (pref.startTime >= pref.endTime) {
        setError("End time must be after start time");
        return;
      }
    }

    mutation.mutate({
      eventId,
      datePreferences: validPreferences.map((p) => ({
        date: p.date,
        startTime: p.startTime,
        endTime: p.endTime,
      })),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Date Preferences</DialogTitle>
          <DialogDescription>
            Modify the date preferences for <strong>{eventName}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {preferences.map((pref, index) => (
              <div
                key={pref.id}
                className="border rounded-lg p-4 space-y-3 relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">
                    Preference {index + 1}
                  </Label>
                  {preferences.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePreference(pref.id)}
                      disabled={mutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`date-${pref.id}`}>Date</Label>
                  <Input
                    id={`date-${pref.id}`}
                    type="date"
                    value={pref.date}
                    onChange={(e) =>
                      updatePreference(pref.id, "date", e.target.value)
                    }
                    disabled={mutation.isPending}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`start-${pref.id}`}>Start Time</Label>
                    <Input
                      id={`start-${pref.id}`}
                      type="time"
                      value={pref.startTime}
                      onChange={(e) =>
                        updatePreference(pref.id, "startTime", e.target.value)
                      }
                      disabled={mutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`end-${pref.id}`}>End Time</Label>
                    <Input
                      id={`end-${pref.id}`}
                      type="time"
                      value={pref.endTime}
                      onChange={(e) =>
                        updatePreference(pref.id, "endTime", e.target.value)
                      }
                      disabled={mutation.isPending}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addPreference}
              disabled={mutation.isPending}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Date Preference
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
