import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons";
import { isAdmin } from "@/lib/admin-config";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, redirect based on role
  if (user) {
    if (isAdmin(user.email)) {
      redirect("/admin");
    } else {
      redirect("/events");
    }
  }

  // Otherwise show login page
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            SAAC Event Management
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Student Activities Advisory Committee
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Sign in with your FLAME University email to manage club events
          </p>
          <form
            action="/auth/signin"
            method="get"
          >
            <Button
              type="submit"
              className="w-full"
              size="lg"
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Sign in with Google
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground">
            Only @flame.edu.in emails are permitted
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
