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

export default function Sidebar({ open, setOpen, isDesktop }: any) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-[1px] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-[70] flex h-dvh flex-col border-r border-black/10 bg-(--color-surface) transition-all duration-300 dark:border-white/10 md:sticky md:top-0 md:z-50",

          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",

          open ? "md:w-56" : "md:w-16",

          "w-56",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-black/10 px-4 dark:border-white/10">
          <div
            className={cn(
              "flex items-center gap-3 transition-all duration-300",
              !open && "md:justify-center md:w-full",
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-primary)/14 text-(--color-primary)">
              <BiCalendar size={18} />
            </div>

            <div
              className={cn(
                "transition-all duration-200",
                !open && "md:hidden",
              )}
            >
              <p className="text-[15px] font-semibold tracking-tight text-(--color-foreground)">
                Schedule App
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="cursor-pointer text-(--color-foreground-muted) transition-colors hover:text-(--color-foreground) md:hidden"
            aria-label="Cerrar menu lateral"
          >
            <TfiClose />
          </button>
        </div>

        <nav
          className={cn(
            "flex-1 space-y-1.5 px-3 py-4",
            open ? "overflow-y-auto" : "overflow-y-auto md:overflow-visible",
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDashboard = item.href === "/admin";
            const isActive = isDashboard
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => {
                    if (!isDesktop) {
                      setOpen(false);
                    }
                  }}
                  aria-label={item.label}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    isActive
                      ? "bg-(--color-primary)/12 font-semibold text-(--color-primary)"
                      : "text-(--color-foreground-muted) hover:bg-(--color-primary)/8 hover:text-(--color-primary)",
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

                {!open && (
                  <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 rounded-lg bg-(--color-surface-card) px-2.5 py-1.5 text-xs font-medium text-(--color-foreground) opacity-0 shadow-md ring-1 ring-black/10 transition-opacity duration-150 group-hover:opacity-100 dark:ring-white/10 md:block">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-black/10 px-3 py-4 dark:border-white/10">
          <div className="group relative">
            <LogoutButton
              className={cn(
                "w-full rounded-xl px-3 py-2 text-(--color-error) transition-all",
                !open && "md:justify-center",
              )}
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

            {!open && (
              <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-(--color-surface-card) px-2.5 py-1.5 text-xs font-medium text-(--color-foreground) opacity-0 shadow-md ring-1 ring-black/10 transition-opacity duration-150 group-hover:opacity-100 dark:ring-white/10 md:block">
                Cerrar sesión
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
