"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { cn } from "@/utils/cn.utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  className,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mainEl = document.querySelector("main");
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (mainEl) mainEl.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      if (mainEl) mainEl.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      if (mainEl) mainEl.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-surface-card border border-foreground/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col",
          maxWidth,
          className
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 sm:px-7 sm:py-7 border-b border-foreground/5">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-low rounded-xl transition-colors text-foreground-muted hover:text-foreground"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="px-4 py-4 sm:px-7 sm:py-7 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 hover:scrollbar-thumb-black/20 dark:hover:scrollbar-thumb-white/20">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
