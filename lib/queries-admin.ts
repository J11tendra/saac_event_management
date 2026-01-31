"use server";

import { createServiceRoleClient } from "./supabase/service-role";
import type { Event } from "./types";

// Fetch all events for admin view
export async function fetchAllEvents(): Promise<Event[]> {
  "use server";
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .schema("saac_thingy")
    .from("event")
    .select(
      `
      *,
      event_date_preference!event_date_preference_event_id_fkey (*),
      budget_request (*),
      event_review!event_review_event_id_fkey (
        *,
        admin (*),
        club (*)
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchAllEvents] Error:", error);
    throw new Error(error.message);
  }

  return data as unknown as Event[];
}

// Approve event
export async function approveEvent(data: {
  eventId: string;
  acceptedDatePreferenceId: string;
  approvedBudget?: number;
  budgetComments?: string;
}): Promise<{ success: boolean; error?: string }> {
  "use server";
  try {
    const supabase = createServiceRoleClient();

    // Update event status with all required fields
    const { error: eventError } = await supabase
      .schema("saac_thingy")
      .from("event")
      .update({
        approval_status: "accepted",
        accepted_date_preference_id: data.acceptedDatePreferenceId,
        approval_date: new Date().toISOString(),
      })
      .eq("id", data.eventId);

    if (eventError) {
      console.error("[approveEvent] Event update error:", eventError);
      return { success: false, error: eventError.message };
    }

    // Update budget if provided
    if (data.approvedBudget !== undefined) {
      const { error: budgetError } = await supabase
        .schema("saac_thingy")
        .from("budget_request")
        .update({
          approved_budget: data.approvedBudget,
          approval_date: new Date().toISOString(),
          approval_comments: data.budgetComments || null,
        })
        .eq("event_id", data.eventId);

      if (budgetError) {
        console.error("[approveEvent] Budget update error:", budgetError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("[approveEvent] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Reject event
export async function rejectEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  "use server";
  try {
    const supabase = createServiceRoleClient();

    // When rejecting, set approval_date to null to satisfy the constraint
    // The constraint likely requires: if status != 'accepted', then approval_date must be null
    const { error } = await supabase
      .schema("saac_thingy")
      .from("event")
      .update({
        approval_status: "rejected",
        approval_date: null, // Set to null for rejected events
        accepted_date_preference_id: null, // Clear accepted date
      })
      .eq("id", eventId);

    if (error) {
      console.error("[rejectEvent] Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[rejectEvent] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
