"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEventReview } from "@/lib/queries";
import type { EventReview } from "@/lib/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, User, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommentsDialogProps {
  eventId: string;
  eventName: string;
  clubId: string;
  comments: EventReview[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentsDialog({
  eventId,
  eventName,
  clubId,
  comments: initialComments,
  open,
  onOpenChange,
}: CommentsDialogProps) {
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] =
    useState<EventReview[]>(initialComments);

  // Sync local comments when initialComments prop changes
  useEffect(() => {
    setLocalComments(initialComments);
  }, [initialComments]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addEventReview,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["events", clubId] });
      setNewComment("");

      // Add the new comment to local state for immediate UI update
      if (result && result.review) {
        setLocalComments((prev) => [...prev, result.review as EventReview]);
      }

      toast.success("Comment added successfully!");
    },
    onError: (err: Error) => {
      toast.error("Failed to add comment", {
        description: err.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    mutation.mutate({
      eventId,
      clubId,
      comment: newComment.trim(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            View and add comments for <strong>{eventName}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Comments List */}
        <ScrollArea className="flex-1 min-h-[50vh] max-h-[60vh] pr-4">
          <div className="space-y-3">
            {localComments.length === 0 ?
              <p className="text-sm text-muted-foreground text-center py-8">
                No comments yet. Be the first to add a comment!
              </p>
            : localComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                />
              ))
            }
          </div>
        </ScrollArea>

        {/* Add Comment Section */}
        <div className="border-t pt-4 mt-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 space-y-1">
              <Textarea
                placeholder="Type your comment here... (Ctrl+Enter to send)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={mutation.isPending}
                rows={2}
                className="resize-none"
              />
            </div>
            <Button
              type="button"
              size="icon"
              onClick={handleSubmit}
              disabled={mutation.isPending || !newComment.trim()}
              className="rounded-full h-10 w-10 shrink-0"
            >
              {mutation.isPending ?
                <Loader2 className="h-4 w-4 animate-spin" />
              : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CommentItemProps {
  comment: EventReview;
}

function CommentItem({ comment }: CommentItemProps) {
  const isAdmin = !!comment.admin_id;
  const authorName =
    comment.admin?.name || comment.club?.club_name || "Unknown";

  return (
    <div
      className={`p-3 rounded-lg ${
        isAdmin ?
          "bg-primary/5 border border-primary/20 ml-0 mr-8"
        : "bg-muted/50 border ml-8 mr-0"
      }`}
    >
      {/* Header with role badge and author */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`p-1 rounded-full ${
            isAdmin ? "bg-primary/10" : "bg-muted"
          }`}
        >
          {isAdmin ?
            <Shield className="w-3 h-3 text-primary" />
          : <User className="w-3 h-3 text-muted-foreground" />}
        </div>
        <span className="text-sm font-medium">{authorName}</span>
        <Badge
          variant={isAdmin ? "default" : "outline"}
          className="text-xs px-1.5 py-0"
        >
          {isAdmin ? "Admin" : "Club"}
        </Badge>
      </div>

      {/* Comment content */}
      <p className="text-sm leading-relaxed">{comment.comment}</p>

      {/* Timestamp */}
      <div className="text-xs text-muted-foreground mt-2">
        {new Date(comment.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
