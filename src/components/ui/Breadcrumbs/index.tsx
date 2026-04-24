"use client";

import Link from "next/link";
import { cn } from "@/utils/cn.utils";

interface BreadcrumbsProps {
  items: {
    label: string;
    href?: string;
  }[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      className={cn(
        "flex items-center gap-2 text-sm text-foreground-muted",
        className,
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="text-foreground-muted/50">/</span>
          )}
        </div>
      ))}
    </nav>
  );
}
