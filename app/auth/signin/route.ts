import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${requestUrl.origin}/auth/callback`,
      queryParams: {
        hd: "flame.edu.in", // Restrict to flame.edu.in domain
      },
    },
  });

  if (error) {
    redirect(`/auth/error?message=${error.message}`);
  }

  // This will never be reached as signInWithOAuth redirects
  redirect("/events");
}
