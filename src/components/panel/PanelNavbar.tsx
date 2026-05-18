"use client";

import LazyLink from "@/components/ui/LazyLink";
import { usePathname } from "next/navigation";
import { FiBook, FiCalendar, FiHome } from "react-icons/fi";
import { cn } from "@/utils/cn.utils";

const navItems = [
  { label: "Inicio", href: "/panel", icon: FiHome },
  { label: "Cursos", href: "/panel/cursos", icon: FiBook },
  { label: "Horario", href: "/panel/horario", icon: FiCalendar },
];

export default function PanelNavbar({ role }: { role?: string }) {
  const pathname = usePathname();

  const filteredNavItems = role === "docente" || role === "apoderado"
    ? navItems.filter((item) => item.href === "/panel")
    : navItems;

  return (
    <nav className="hidden md:flex items-center gap-1">
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isHome = item.href === "/panel";
        const isActive = isHome 
          ? pathname === item.href 
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <LazyLink
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              isActive
                ? "text-primary bg-primary/5"
                : "text-foreground-muted hover:text-primary hover:bg-primary/5"
            )}
          >
            <Icon size={16} />
            {item.label}
          </LazyLink>
        );
      })}
    </nav>
  );
}
