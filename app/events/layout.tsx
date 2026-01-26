"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clubInfo, setClubInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // Get club info from the window object (set by events-client)
    const checkClubInfo = () => {
      const info = (
        window as Window &
          typeof globalThis & {
            __clubInfo?: { name: string; email: string };
            __openCreateEventDialog?: () => void;
          }
      ).__clubInfo;
      if (info) {
        setClubInfo(info);
      }
    };

    checkClubInfo();
    const interval = setInterval(checkClubInfo, 100);

    return () => clearInterval(interval);
  }, []);

  const handleCreateEvent = () => {
    const openDialog = (
      window as Window &
        typeof globalThis & {
          __clubInfo?: { name: string; email: string };
          __openCreateEventDialog?: () => void;
        }
    ).__openCreateEventDialog;
    if (openDialog) {
      openDialog();
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar
        onCreateEvent={handleCreateEvent}
        clubName={clubInfo?.name}
        clubEmail={clubInfo?.email}
      />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="h-6"
          />
          <div className="flex items-center justify-between flex-1">
            <h1 className="text-lg font-semibold">Event Management</h1>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
