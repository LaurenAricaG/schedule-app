"use client";

import { TfiMenu } from "react-icons/tfi";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Header({ open, setOpen, user }: any) {
  return (
    <header className="z-50 border-b border-black/10 bg-(--color-surface)/80 backdrop-blur dark:border-white/10">
      <div className="flex h-16 items-center justify-between px-4 md:px-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="cursor-pointer rounded-xl border border-black/10 bg-(--color-surface-card) p-2 text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground) dark:border-white/10"
            aria-label="Abrir o cerrar menu"
          >
            <TfiMenu />
          </button>

          <h1 className="text-[1.05rem] font-semibold tracking-tight text-(--color-foreground)">
            Mi Panel
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="rounded-full border border-black/10 bg-(--color-surface-card) px-3 py-1 dark:border-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--color-foreground-muted)">
              {user?.rol ?? "admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
