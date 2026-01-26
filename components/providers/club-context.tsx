"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Club } from "@/lib/types";

interface ClubContextType {
  club: Club | null;
  setClub: (club: Club | null) => void;
  openCreateEventDialog: () => void;
  setCreateEventDialogHandler: (handler: () => void) => void;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export function ClubProvider({ children }: { children: ReactNode }) {
  const [club, setClub] = useState<Club | null>(null);
  const [dialogHandler, setDialogHandler] = useState<(() => void) | null>(null);

  const openCreateEventDialog = useCallback(() => {
    dialogHandler?.();
  }, [dialogHandler]);

  const setCreateEventDialogHandler = useCallback((handler: () => void) => {
    setDialogHandler(() => handler);
  }, []);

  return (
    <ClubContext.Provider
      value={{
        club,
        setClub,
        openCreateEventDialog,
        setCreateEventDialogHandler,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
}

export function useClub() {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error("useClub must be used within a ClubProvider");
  }
  return context;
}
