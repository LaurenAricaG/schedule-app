"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useMediaQuery } from "@/hooks/use-media-query";

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
    if (!isDesktop) {
      setIsMobileOpen(false);
    }
  }, [isDesktop]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1">
        <Header open={open} setOpen={setOpen} user={user} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
