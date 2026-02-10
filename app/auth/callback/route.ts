import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("[auth/callback] Callback handler invoked");

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/events";

  console.log("[auth/callback] Parameters:", {
    code: code ? "present" : "missing",
    next,
  });

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log("[auth/callback] Error exchanging code for session:", error);
      return NextResponse.redirect(
        `${origin}/auth/error?message=Authentication failed: ${error.message}`
      );
    }

    if (data.user) {
      console.log("[auth/callback] User authenticated:", data.user.email);

      // Check if email is from flame.edu.in domain
      const email = data.user.email;
      if (!email?.endsWith("@flame.edu.in")) {
        console.log("[auth/callback] Email domain not allowed:", email);
        // Sign out the user
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/auth/error?message=Only flame.edu.in emails are allowed`
        );
      }

      console.log("[auth/callback] Checking for existing club profile:", email);

      // Use service role client for database operations
      const serviceClient = createServiceRoleClient();

      // Check if club profile exists, if not create one
      const { data: existingClub, error: clubFetchError } = await serviceClient
        .schema("saac_thingy")
        .from("club")
        .select("id")
        .eq("club_email", email)
        .maybeSingle();

      if (clubFetchError) {
        console.log("[auth/callback] Error fetching club:", clubFetchError);
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/auth/error?message=Database error: ${clubFetchError.message}`
        );
      }

      if (!existingClub) {
        console.log("[auth/callback] Creating new club profile for:", email);

        // Extract club name from email (before @)
        const clubName = email.split("@")[0];

        const { error: insertError } = await serviceClient
          .schema("saac_thingy")
          .from("club")
          .insert({
            club_name: clubName,
            club_email: email,
          });

        if (insertError) {
          console.log(
            "[auth/callback] Error creating club profile:",
            insertError
          );

          // If insert fails (e.g., due to unique constraint), try to fetch again
          // This handles race conditions where multiple requests try to create the same club
          const { data: retryClub } = await serviceClient
            .schema("saac_thingy")
            .from("club")
            .select("id")
            .eq("club_email", email)
            .maybeSingle();

          if (!retryClub) {
            console.log(
              "[auth/callback] Failed to create or find club after retry"
            );
            await supabase.auth.signOut();
            return NextResponse.redirect(
              `${origin}/auth/error?message=Failed to create club profile: ${insertError.message}`
            );
          }

          console.log("[auth/callback] Club found on retry:", retryClub);
        } else {
          console.log("[auth/callback] Club profile created successfully");
        }
      } else {
        console.log(
          "[auth/callback] Existing club profile found:",
          existingClub.id
        );
      }

      console.log("[auth/callback] Redirecting to:", next);
      // Check if user is admin and redirect accordingly
      const { isAdmin: checkIsAdmin } = await import("@/lib/admin-config");
      if (checkIsAdmin(email)) {
        console.log("[auth/callback] User is admin, redirecting to admin dashboard");
        return NextResponse.redirect(`${origin}/admin`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  console.log("[auth/callback] No code provided or user not found");
  return NextResponse.redirect(
    `${origin}/auth/error?message=Authentication failed`
  );
}
