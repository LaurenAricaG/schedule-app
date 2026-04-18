"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

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
      <ErrorBoundary variant="compact" title="No se pudo cargar el menú lateral">
        <Sidebar open={open} setOpen={setOpen} isDesktop={isDesktop} />
      </ErrorBoundary>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 
        Scroll desde el header
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto"> 
      */}
        <ErrorBoundary variant="compact" title="No se pudo cargar la barra superior">
          <Header open={open} setOpen={setOpen} user={user} />
        </ErrorBoundary>
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
          <ErrorBoundary
            variant="embedded"
            title="No se pudo mostrar esta sección"
          >
            {children}
          </ErrorBoundary>
        </main>
        {/* 
          Scroll desde el contenido
          <main className="flex-1 p-8">{children}</main> 
        */}
      </div>
    </div>
  );
}
