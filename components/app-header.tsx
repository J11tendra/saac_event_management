"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AppHeader() {
  const { state } = useSidebar();
  const router = useRouter();
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="h-6"
      />
      <div className="flex items-center justify-between flex-1">
        <h1 className="text-lg font-semibold">Event Management</h1>
        <div className="flex items-center gap-2">
          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign Out</span>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
