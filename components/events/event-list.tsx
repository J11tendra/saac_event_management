"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  IndianRupee,
  ChevronDown,
  DollarSign,
  MessageSquare,
  Edit,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Event } from "@/lib/queries";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddBudgetDialog } from "./add-budget-dialog";
import { AddReviewDialog } from "./add-review-dialog";
import { EditDatePreferencesDialog } from "./edit-date-preferences-dialog";

interface EventListProps {
  events: Event[];
  clubId: string;
  onRefetch: () => void;
}

export function EventList({ events, clubId }: EventListProps) {
  console.log("[EventList] Rendering with events:", events);

  const [budgetDialogState, setBudgetDialogState] = useState<{
    open: boolean;
    eventId: string;
    eventName: string;
  }>({ open: false, eventId: "", eventName: "" });

  const [reviewDialogState, setReviewDialogState] = useState<{
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-chart-2/20 text-chart-2 border border-chart-2/30";
      case "rejected":
        return "bg-destructive/20 text-destructive border border-destructive/30";
      default:
        return "bg-chart-4/20 text-chart-4 border border-chart-4/30";
    }
  };

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
          <Card
            key={event.id}
            className="hover:bg-accent/50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Event Name and Status */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-base leading-tight flex-1">
                    {event.event_name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${getStatusColor(
                      event.approval_status
                    )}`}
                  >
                    {event.approval_status.toUpperCase()}
                  </span>
                </div>

                {/* Event Description */}
                <p className="text-sm text-muted-foreground">
                  {event.event_descriptions}
                </p>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {/* Budget */}
                  {event.budget_request ? (
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      <span>
                        ₹
                        {event.budget_request.budget_amt.toLocaleString(
                          "en-IN"
                        )}
                        {event.budget_request.approved_budget && (
                          <span className="text-chart-2 font-semibold ml-1">
                            (✓ ₹
                            {event.budget_request.approved_budget.toLocaleString(
                              "en-IN"
                            )}
                            )
                          </span>
                        )}
                      </span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setBudgetDialogState({
                          open: true,
                          eventId: event.id,
                          eventName: event.event_name,
                        })
                      }
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Add Budget Request
                    </Button>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center gap-1 text-xs">
                    <span>
                      Created{" "}
                      {new Date(event.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Budget Details Section */}
                {event.budget_request && (
                  <div className="border-t pt-3">
                    <div className="bg-muted/50 rounded-md p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold">
                            Budget Purpose
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.budget_request.purpose}
                          </p>
                        </div>
                      </div>
                      {event.budget_request.approval_comments && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-sm font-semibold">
                            Approval Comments
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.budget_request.approval_comments}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setReviewDialogState({
                        open: true,
                        eventId: event.id,
                        eventName: event.event_name,
                      })
                    }
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Add Comment
                  </Button>

                  {/* Only show edit date preferences if event is not approved */}
                  {event.approval_status !== "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDateDialogState({
                          open: true,
                          eventId: event.id,
                          eventName: event.event_name,
                          currentPreferences: event.event_date_preference || [],
                        })
                      }
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Date Preferences
                    </Button>
                  )}
                </div>

                {/* Collapsible Date Preferences */}
                {event.event_date_preference &&
                  event.event_date_preference.length > 0 && (
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
                              {event.accepted_date_preference_id
                                ? (() => {
                                    const acceptedPref =
                                      event.event_date_preference.find(
                                        (p) =>
                                          p.id ===
                                          event.accepted_date_preference_id
                                      );
                                    return acceptedPref ? (
                                      <>
                                        {new Date(
                                          acceptedPref.date
                                        ).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}{" "}
                                        • {acceptedPref.start_time} -{" "}
                                        {acceptedPref.end_time}
                                      </>
                                    ) : (
                                      `Date Preferences (${event.event_date_preference.length})`
                                    );
                                  })()
                                : `Date Preferences (${event.event_date_preference.length})`}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2 space-y-2">
                        {event.event_date_preference.map((pref) => (
                          <div
                            key={pref.id}
                            className={`text-sm p-3 rounded-md ${
                              event.accepted_date_preference_id === pref.id
                                ? "bg-chart-2/10 border border-chart-2/30"
                                : "bg-muted/50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 font-medium">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(pref.date).toLocaleDateString(
                                    "en-IN",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {pref.start_time} - {pref.end_time}
                                </div>
                              </div>
                              {event.accepted_date_preference_id ===
                                pref.id && (
                                <span className="text-chart-2 font-semibold text-xs whitespace-nowrap">
                                  ✓ Accepted
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                {/* Event Reviews/Comments Section */}
                {event.event_review && event.event_review.length > 0 && (
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between p-2 h-auto"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-medium">
                            Comments ({event.event_review.length})
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 space-y-2">
                      {event.event_review.map((review) => (
                        <div
                          key={review.id}
                          className="text-sm p-3 rounded-md bg-muted/50 border"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm">{review.comment}</p>
                              </div>
                              {review.admin_id && (
                                <Badge variant="secondary">Admin</Badge>
                              )}
                              {review.club_id && (
                                <Badge variant="outline">Club</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                              {review.admin && ` • ${review.admin.name}`}
                              {review.club && ` • ${review.club.club_name}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </CardContent>
          </Card>
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

      <AddReviewDialog
        eventId={reviewDialogState.eventId}
        eventName={reviewDialogState.eventName}
        clubId={clubId}
        open={reviewDialogState.open}
        onOpenChange={(open) =>
          setReviewDialogState({ ...reviewDialogState, open })
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
    </>
  );
}
