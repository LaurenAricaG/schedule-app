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

export default function PanelMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-black/5 px-6 py-3 flex justify-between items-center z-50 dark:bg-surface-card/80 dark:border-white/5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <LazyLink
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors relative",
              isActive ? "text-primary" : "text-foreground-muted hover:text-primary"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {isActive && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </LazyLink>
        );
      })}
    </nav>
  );
}
