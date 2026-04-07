"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/logout-button";
import { cn } from "@/utils/cn.utils";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { BiBookOpen, BiCalendar, BiLogOut, BiShield } from "react-icons/bi";
import { TfiClose } from "react-icons/tfi";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LuLayoutDashboard },
  { label: "Usuarios", href: "/admin/usuarios", icon: FaUsers },
  { label: "Cursos", href: "/admin/cursos", icon: BiBookOpen },
  { label: "Roles", href: "/admin/roles", icon: BiShield },
];

export default function Sidebar({ open, setOpen }: any) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky md:top-0 z-50 top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",

          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",

          open ? "md:w-56" : "md:w-16",

          "w-56",
        )}
      >
        <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between">
          <div
            className={cn(
              "flex items-center gap-3 transition-all duration-300",
              !open && "md:justify-center md:w-full",
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 text-white">
              <BiCalendar size={18} />
            </div>

            <div
              className={cn(
                "transition-all duration-200",
                !open && "md:hidden",
              )}
            >
              <p className="font-medium text-sm">Schedule App</p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-500 cursor-pointer"
          >
            <TfiClose />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                    !open && "md:justify-center",
                  )}
                >
                  <Icon size={18} />

                  <span
                    className={cn(
                      "transition-all duration-200",
                      !open && "md:hidden",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="mt-auto px-3 py-4 border-t border-gray-200">
          <LogoutButton
            className={cn("w-full px-3 py-2", !open && "md:justify-center")}
          >
            <BiLogOut size={18} />

            <span
              className={cn(
                "transition-all duration-200",
                !open && "md:hidden",
              )}
            >
              Cerrar sesión
            </span>
          </LogoutButton>
        </div>
      </aside>
    </>
  );
}
