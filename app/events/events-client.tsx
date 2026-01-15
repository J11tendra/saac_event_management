"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { createEvent, type Event } from "@/lib/queries";
import { ThemeToggle } from "@/components/theme-toggle";
import { Plus, LogOut, Calendar, Clock, IndianRupee } from "lucide-react";

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
  events: Event[];
  user: User;
}

export default function EventsClient({ club, events, user }: Props) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    budgetAmount: "",
    budgetPurpose: "",
    datePreferences: [
      { date: "", startTime: "", endTime: "" },
      { date: "", startTime: "", endTime: "" },
      { date: "", startTime: "", endTime: "" },
    ],
  });

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Event created successfully!", {
          description: "Your event has been submitted for approval.",
        });
        // Reset form
        setFormData({
          eventName: "",
          eventDescription: "",
          budgetAmount: "",
          budgetPurpose: "",
          datePreferences: [
            { date: "", startTime: "", endTime: "" },
            { date: "", startTime: "", endTime: "" },
            { date: "", startTime: "", endTime: "" },
          ],
        });
        setShowCreateForm(false);
        // Refresh the page to show new event
        router.refresh();
      } else {
        toast.error("Failed to create event", {
          description: result.error,
        });
      }
    },
    onError: (error: Error) => {
      console.error("[events/mutation] Error creating event:", error);
      toast.error("Failed to create event", {
        description: error.message,
      });
    },
  });

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createEventMutation.mutate({
      club_id: club.id,
      event_name: formData.eventName,
      event_descriptions: formData.eventDescription,
      datePreferences: formData.datePreferences,
      budgetAmount: formData.budgetAmount,
      budgetPurpose: formData.budgetPurpose,
    });
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Event Management
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {club.club_name} • {user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Event Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Event
          </Button>
        </div>

        {/* Create Event Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
              <CardDescription>
                Fill in the details for your event. All fields are required
                except budget information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Event Name */}
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    value={formData.eventName}
                    onChange={(e) =>
                      setFormData({ ...formData, eventName: e.target.value })
                    }
                    required
                    placeholder="e.g., Annual Cultural Fest"
                  />
                </div>

                {/* Event Description */}
                <div className="space-y-2">
                  <Label htmlFor="eventDescription">Event Description *</Label>
                  <Textarea
                    id="eventDescription"
                    value={formData.eventDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eventDescription: e.target.value,
                      })
                    }
                    required
                    rows={4}
                    placeholder="Describe your event, including objectives, expected attendees, and activities..."
                  />
                </div>

                {/* Date Preferences */}
                <div className="space-y-4">
                  <Label>Date Preferences (provide at least one)</Label>
                  {formData.datePreferences.map((pref, index) => (
                    <Card
                      key={index}
                      className="p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`date-${index}`}>Date</Label>
                          <Input
                            id={`date-${index}`}
                            type="date"
                            value={pref.date}
                            onChange={(e) => {
                              const newPrefs = [...formData.datePreferences];
                              newPrefs[index].date = e.target.value;
                              setFormData({
                                ...formData,
                                datePreferences: newPrefs,
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`start-${index}`}>Start Time</Label>
                          <Input
                            id={`start-${index}`}
                            type="time"
                            value={pref.startTime}
                            onChange={(e) => {
                              const newPrefs = [...formData.datePreferences];
                              newPrefs[index].startTime = e.target.value;
                              setFormData({
                                ...formData,
                                datePreferences: newPrefs,
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`end-${index}`}>End Time</Label>
                          <Input
                            id={`end-${index}`}
                            type="time"
                            value={pref.endTime}
                            onChange={(e) => {
                              const newPrefs = [...formData.datePreferences];
                              newPrefs[index].endTime = e.target.value;
                              setFormData({
                                ...formData,
                                datePreferences: newPrefs,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Budget Request */}
                <div className="space-y-4">
                  <Label>Budget Request (Optional)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budgetAmount">Budget Amount (₹)</Label>
                      <Input
                        id="budgetAmount"
                        type="number"
                        step="0.01"
                        value={formData.budgetAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            budgetAmount: e.target.value,
                          })
                        }
                        placeholder="e.g., 50000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetPurpose">Purpose</Label>
                      <Input
                        id="budgetPurpose"
                        value={formData.budgetPurpose}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            budgetPurpose: e.target.value,
                          })
                        }
                        placeholder="e.g., Venue rental, equipment, refreshments"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createEventMutation.isPending}
                  >
                    {createEventMutation.isPending
                      ? "Creating..."
                      : "Create Event"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Events</h2>
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No events yet. Create your first event to get started!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.event_name}</CardTitle>
                        <CardDescription className="mt-2">
                          {event.event_descriptions}
                        </CardDescription>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          event.approval_status
                        )}`}
                      >
                        {event.approval_status.toUpperCase()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Date Preferences */}
                      {event.event_date_preference &&
                        event.event_date_preference.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Date Preferences
                            </h4>
                            <div className="space-y-2">
                              {event.event_date_preference.map((pref) => (
                                <div
                                  key={pref.id}
                                  className={`text-sm p-2 rounded ${
                                    event.accepted_date_preference_id ===
                                    pref.id
                                      ? "bg-chart-2/10 border border-chart-2/30"
                                      : "bg-muted/50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {new Date(pref.date).toLocaleDateString(
                                      "en-IN",
                                      {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}{" "}
                                    • {pref.start_time} - {pref.end_time}
                                    {event.accepted_date_preference_id ===
                                      pref.id && (
                                      <span className="ml-auto text-chart-2 font-semibold">
                                        ✓ Accepted
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Budget Request */}
                      {event.budget_request &&
                        event.budget_request.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center">
                              <IndianRupee className="w-4 h-4 mr-2" />
                              Budget Request
                            </h4>
                            {event.budget_request.map((budget, idx) => (
                              <div
                                key={idx}
                                className="text-sm bg-muted/50 p-2 rounded"
                              >
                                <p>
                                  <span className="font-medium">
                                    Requested:
                                  </span>{" "}
                                  ₹{budget.budget_amt.toLocaleString("en-IN")}
                                </p>
                                <p>
                                  <span className="font-medium">Purpose:</span>{" "}
                                  {budget.purpose}
                                </p>
                                {budget.approved_budget && (
                                  <p className="text-chart-2 font-semibold">
                                    Approved: ₹
                                    {budget.approved_budget.toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Metadata */}
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Created on{" "}
                        {new Date(event.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                        {event.approval_date && (
                          <>
                            {" • "}
                            {event.approval_status === "approved"
                              ? "Approved"
                              : "Reviewed"}{" "}
                            on{" "}
                            {new Date(event.approval_date).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
