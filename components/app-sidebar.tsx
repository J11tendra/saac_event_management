"use client";

import * as React from "react";
import { CalendarDays, Home, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Events",
    url: "/events",
    icon: CalendarDays,
  },
];

export function AppSidebar({
  onCreateEvent,
  clubName,
  clubEmail,
}: {
  onCreateEvent?: () => void;
  clubName?: string;
  clubEmail?: string;
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
            >
              <Link href="/events">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">SAAC</span>
                  <span className="text-xs">Event Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <div className="flex items-center gap-1 w-full">
                    <SidebarMenuButton
                      asChild
                      className="flex-1"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={onCreateEvent}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Create new event</span>
                    </Button>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {clubName && clubEmail && (
          <UserProfile
            clubName={clubName}
            clubEmail={clubEmail}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
