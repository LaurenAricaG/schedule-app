"use client";

import { cn } from "@/utils/cn.utils";

interface TitleProps {
  title: string;
  className?: string;
}

export default function Title({ title, className }: TitleProps) {
  return (
    <h1 className={cn("text-3xl font-bold text-foreground", className)}>
      {title}
    </h1>
  );
}
