import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${requestUrl.origin}/auth/callback`,
      queryParams: {
        hd: "flame.edu.in", // Restrict to flame.edu.in domain
      },
    },
  });

  if (error) {
    console.log("[auth/signin] Error:", error.message);
    redirect(`/auth/error?message=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    // Redirect to the OAuth provider's authorization page
    return NextResponse.redirect(data.url);
  }

  // Fallback - this shouldn't happen
  console.log("[auth/signin] No URL returned from signInWithOAuth");
  redirect("/auth/error?message=Failed to initiate sign in");
}
