import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("[auth/signout] Sign out requested");

  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log("[auth/signout] Error signing out:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("[auth/signout] Sign out successful");
  return NextResponse.json({ success: true });
}
