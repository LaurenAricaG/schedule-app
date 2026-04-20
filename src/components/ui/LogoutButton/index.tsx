"use client";

import { logout } from "@/lib/auth/action";
import { cn } from "@/utils/cn.utils";
import { useTransition } from "react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({
  className,
  children,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-error transition-colors hover:bg-error/10 disabled:opacity-50",
        className,
      )}
    >
      {isPending ? "Cerrando sesión..." : children}
    </button>
  );
}
