"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ClubProvider, useClub } from "@/components/providers/club-context";

function EventsLayoutContent({ children }: { children: React.ReactNode }) {
  const { club, openCreateEventDialog } = useClub();

  return (
    <SidebarProvider>
      <AppSidebar
        onCreateEvent={openCreateEventDialog}
        clubName={club?.club_name}
        clubEmail={club?.club_email}
      />
      <SidebarInset>
        <AppHeader />
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClubProvider>
      <EventsLayoutContent>{children}</EventsLayoutContent>
    </ClubProvider>
  );
}
