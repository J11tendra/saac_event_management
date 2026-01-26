"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEventReview } from "@/lib/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddReviewDialogProps {
  eventId: string;
  eventName: string;
  clubId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReviewDialog({
  eventId,
  eventName,
  clubId,
  open,
  onOpenChange,
}: AddReviewDialogProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addEventReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", clubId] });
      setComment("");
      setError("");
      onOpenChange(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to add comment");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }

    mutation.mutate({
      eventId,
      clubId,
      comment: comment.trim(),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>
            Add a comment or note for <strong>{eventName}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Enter your comment or notes about this event..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={mutation.isPending}
                rows={5}
              />
            </div>
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
              Add Comment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
