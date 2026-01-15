"use server";

import { createServiceRoleClient } from "./supabase/service-role";
import { revalidatePath } from "next/cache";

export interface EventDatePreference {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface BudgetRequest {
  budget_amt: number;
  purpose: string;
  approved_budget: number | null;
  approval_date: string | null;
}

export interface Event {
  id: string;
  event_name: string;
  event_descriptions: string;
  approval_status: string;
  approval_date: string | null;
  created_at: string;
  accepted_date_preference_id: string | null;
  event_date_preference: EventDatePreference[];
  budget_request: BudgetRequest[];
}

export interface CreateEventData {
  club_id: string;
  event_name: string;
  event_descriptions: string;
  datePreferences: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  budgetAmount?: string;
  budgetPurpose?: string;
}

export async function createEvent(data: CreateEventData) {
  try {
    console.log("[queries/createEvent] Starting event creation");

    const supabase = createServiceRoleClient();

    // Create the event
    const { data: eventData, error: eventError } = await supabase
      .schema("saac_thingy")
      .from("event")
      .insert({
        club_id: data.club_id,
        event_name: data.event_name,
        event_descriptions: data.event_descriptions,
        approval_status: "pending",
      })
      .select()
      .single();

    if (eventError) {
      console.log("[queries/createEvent] Error creating event:", eventError);
      return { success: false, error: eventError.message };
    }

    console.log("[queries/createEvent] Event created:", eventData.id);

    // Add date preferences
    const datePreferencesToInsert = data.datePreferences
      .filter((pref) => pref.date && pref.startTime && pref.endTime)
      .map((pref) => ({
        event_id: eventData.id,
        date: pref.date,
        start_time: pref.startTime,
        end_time: pref.endTime,
        proposer_role: "club",
      }));

    console.log(
      "[queries/createEvent] Adding",
      datePreferencesToInsert.length,
      "date preferences"
    );

    if (datePreferencesToInsert.length > 0) {
      const { error: dateError } = await supabase
        .schema("saac_thingy")
        .from("event_date_preference")
        .insert(datePreferencesToInsert);

      if (dateError) {
        console.log(
          "[queries/createEvent] Error adding date preferences:",
          dateError
        );
        return { success: false, error: dateError.message };
      }

      console.log("[queries/createEvent] Date preferences added successfully");
    }

    // Add budget request if provided
    if (data.budgetAmount && data.budgetPurpose) {
      console.log(
        "[queries/createEvent] Adding budget request:",
        data.budgetAmount
      );

      const { error: budgetError } = await supabase
        .schema("saac_thingy")
        .from("budget_request")
        .insert({
          event_id: eventData.id,
          budget_amt: parseFloat(data.budgetAmount),
          purpose: data.budgetPurpose,
        });

      if (budgetError) {
        console.log(
          "[queries/createEvent] Error adding budget request:",
          budgetError
        );
        return { success: false, error: budgetError.message };
      }

      console.log("[queries/createEvent] Budget request added successfully");
    }

    console.log("[queries/createEvent] Event creation complete");

    // Revalidate the events page
    revalidatePath("/events");

    return { success: true, event: eventData };
  } catch (error) {
    console.error("[queries/createEvent] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
