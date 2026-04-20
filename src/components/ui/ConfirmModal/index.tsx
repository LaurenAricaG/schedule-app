"use client";

import { cn } from "@/utils/cn.utils";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmClassName?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  isPending?: boolean;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmClassName = "bg-error hover:opacity-90",
  icon,
  iconClassName,
  isPending = false,
}: ConfirmModalProps) {
  if (!open) return null;

  const handleBackdropClick = () => {
    if (isPending) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-xs rounded-2xl border border-black/8 bg-surface-card p-6 shadow-xl dark:border-white/10 md:max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                iconClassName,
              )}
            >
              {icon}
            </div>
          )}
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>

        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">
            {description}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-low disabled:opacity-50 dark:border-white/10"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "flex h-9 w-24 items-center justify-center rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-70",
              confirmClassName,
            )}
          >
            {isPending ? (
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:300ms]" />
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
