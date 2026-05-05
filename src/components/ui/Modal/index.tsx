"use client";

import { ReactNode, useEffect } from "react";
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
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
        
        <div className="px-4 py-4 sm:px-7 sm:py-7 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
