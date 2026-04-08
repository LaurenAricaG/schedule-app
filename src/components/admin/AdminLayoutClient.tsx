"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useMediaQuery } from "@/hooks/use-media-query";

const DESKTOP_SIDEBAR_STORAGE_KEY = "admin-sidebar-desktop-open";

export default function AdminLayoutClient({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const open = isDesktop ? isDesktopOpen : isMobileOpen;
  const setOpen = isDesktop ? setIsDesktopOpen : setIsMobileOpen;

  useEffect(() => {
    const storedDesktopState = window.localStorage.getItem(
      DESKTOP_SIDEBAR_STORAGE_KEY,
    );
    if (storedDesktopState === null) return;

    setIsDesktopOpen(storedDesktopState === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      DESKTOP_SIDEBAR_STORAGE_KEY,
      String(isDesktopOpen),
    );
  }, [isDesktopOpen]);

  useEffect(() => {
    if (!isDesktop) {
      setIsMobileOpen(false);
    }
  }, [isDesktop]);

  return (
    <div className="flex h-dvh overflow-hidden bg-(--color-surface)">
      <Sidebar open={open} setOpen={setOpen} isDesktop={isDesktop} />

      <div className="flex min-w-0 flex-1 flex-col">
      {/* 
        Scroll desde el header
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto"> 
      */}
        <Header open={open} setOpen={setOpen} user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        {/* 
          Scroll desde el contenido
          <main className="flex-1 p-8">{children}</main> 
        */}
      </div>
    </div>
    
  );
}
