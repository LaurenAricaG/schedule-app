"use client";

import { logout } from "@/lib/auth/action";
import { useTransition } from "react";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({
  className = "w-full px-4 py-2",
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
      className={`${className} text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50`}
    >
      {isPending ? "Cerrando sesión..." : "Cerrar sesión"}
    </button>
  );
}
