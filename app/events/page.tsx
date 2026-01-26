import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { redirect } from "next/navigation";
import EventsClient from "./events-client";
import type { Event } from "@/lib/types";

export default async function EventsPage() {
  console.log("[events/page] Events page accessed");

  const supabase = await createClient();
  const serviceClient = createServiceRoleClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("[events/page] No user found, redirecting to home");
    redirect("/");
  }

  console.log("[events/page] User authenticated:", user.email);

  // Get club ID for the logged-in user using service role client
  const { data: club, error: clubError } = await serviceClient
    .schema("saac_thingy")
    .from("club")
    .select("id, club_name, club_email")
    .eq("club_email", user.email)
    .maybeSingle();

  if (clubError) {
    console.log("[events/page] Error fetching club:", clubError);
    redirect(`/auth/error?message=Database error: ${clubError.message}`);
  }

  if (!club) {
    console.log(
      "[events/page] Club not found, attempting to create:",
      user.email,
    );

    // Try to create the club if it doesn't exist using service role client
    const clubName = user.email?.split("@")[0] || "Unknown Club";
    const { data: newClub, error: createError } = await serviceClient
      .schema("saac_thingy")
      .from("club")
      .insert({
        club_name: clubName,
        club_email: user.email,
      })
      .select("id, club_name, club_email")
      .single();

    if (createError || !newClub) {
      console.log("[events/page] Error creating club:", createError);
      redirect(
        "/auth/error?message=Club profile not found and could not be created",
      );
    }

    console.log("[events/page] Club created successfully:", newClub.id);

    // Use the newly created club
    const { data: events, error: eventsError } = await serviceClient
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
      `,
      )
      .eq("club_id", newClub.id)
      .order("created_at", { ascending: false });

    if (eventsError) {
      console.log("[events/page] Error fetching events:", eventsError);
    }

    console.log(
      "[events/page] Fetched",
      events?.length || 0,
      "events for new club",
    );
    return (
      <EventsClient
        club={newClub}
        initialEvents={(events as Event[]) || []}
        user={user}
      />
    );
  }

  console.log("[events/page] Club found:", club.id);

  // Fetch events for this club using service role client
  const { data: events, error: eventsError } = await serviceClient
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
    `,
    )
    .eq("club_id", club.id)
    .order("created_at", { ascending: false });

  if (eventsError) {
    console.log("[events/page] Error fetching events:", eventsError);
  }

  console.log("[events/page] Fetched", events?.length || 0, "events for club");
  return (
    <EventsClient
      club={club}
      initialEvents={(events as Event[]) || []}
      user={user}
    />
  );
}
