// components/admin/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/logout-button";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Usuarios", href: "/admin/usuarios" },
  { label: "Cursos", href: "/admin/cursos" },
  { label: "Roles", href: "/admin/roles" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <p className="font-medium text-sm">Schedule App</p>
        <p className="text-xs text-gray-400 mt-0.5">Panel admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === item.href
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <LogoutButton className="w-full px-3 py-2" />
      </div>
    </aside>
  );
}
