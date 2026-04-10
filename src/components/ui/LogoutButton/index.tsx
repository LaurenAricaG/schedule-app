"use client";

import { logout } from "@/lib/auth/action";
import { cn } from "@/utils/cn.utils";
import { useTransition } from "react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({
  className = "w-full px-4 py-2",
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
        "flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50",
        className,
      )}
    >
      {isPending ? "Cerrando sesión..." : children}
    </button>
  );
}
