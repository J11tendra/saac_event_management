import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-config";
import AdminCalendarClient from "./admin-calendar-client";
import { fetchAllEvents } from "@/lib/queries-admin";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Check if user is admin
  if (!isAdmin(user.email)) {
    redirect("/events");
  }

  // Fetch all events
  const events = await fetchAllEvents();

  return <AdminCalendarClient user={user} initialEvents={events} />;
}
