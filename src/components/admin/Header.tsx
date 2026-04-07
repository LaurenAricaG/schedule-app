"use client";

import { TfiMenu } from "react-icons/tfi";

export default function Header({ open, setOpen, user }: any) {
  return (
    <header className="sticky top-0 z-50 bg-(--color-surface-card) border-b border-(--color-surface-low)">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-(--color-surface-low) cursor-pointer"
          >
            <TfiMenu />
          </button>

          <h1 className="text-lg font-semibold">Mi Panel</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-semibold text-[--color-foreground-muted]">
              {user.rol}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
