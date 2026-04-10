"use client";

import { useEffect } from "react";

export type ErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
  variant?: "full" | "embedded" | "compact";
  title?: string;
};

export function ErrorFallback({
  error,
  reset,
  variant = "full",
  title = "Algo salió mal",
}: ErrorFallbackProps) {
  useEffect(() => {
    console.error("[ErrorFallback]", error);
  }, [error]);

  const message =
    typeof error.message === "string" && error.message.length > 0
      ? error.message
      : "Ocurrió un error inesperado.";

  const showDevDetails = process.env.NODE_ENV === "development";

  if (variant === "compact") {
    return (
      <div
        role="alert"
        className="rounded-xl border border-error/30 bg-error/8 p-4 text-(--color-foreground)"
      >
        <p className="text-sm font-semibold text-(--color-error)">{title}</p>
        <p className="mt-1 text-sm text-(--color-foreground-muted)">
          {message}
        </p>
        {error.digest ? (
          <p className="mt-2 font-mono text-xs text-(--color-foreground-muted)">
            digest: {error.digest}
          </p>
        ) : null}
        {showDevDetails ? (
          <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-(--color-surface-low) p-2 text-xs text-(--color-foreground-muted) whitespace-pre-wrap wrap-break-word">
            {error.stack ?? String(error)}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="mt-3 rounded-lg bg-(--color-primary) px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (variant === "embedded") {
    return (
      <div className="flex h-full items-center justify-center">
        <div
          role="alert"
          className="rounded-2xl border border-black/10 bg-(--color-surface-card) p-6 dark:border-white/10"
        >
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-(--color-foreground-muted)">
            Error en esta sección
          </p>
          <h2 className="mt-2 text-xl font-semibold text-(--color-error)">
            {title}
          </h2>
          <p className="mt-2 text-sm text-(--color-foreground-muted)">
            {message}
          </p>
          {error.digest ? (
            <p className="mt-2 font-mono text-xs text-(--color-foreground-muted)">
              digest: {error.digest}
            </p>
          ) : null}
          {showDevDetails ? (
            <pre className="mt-4 max-h-48 overflow-auto rounded-xl bg-(--color-surface-low) p-3 text-xs text-(--color-foreground-muted) whitespace-pre-wrap wrap-break-word">
              {error.stack ?? String(error)}
            </pre>
          ) : null}
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-xl bg-(--color-primary) px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex min-h-[50vh] flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-lg rounded-2xl border border-black/10 bg-(--color-surface-card) p-8 shadow-sm dark:border-white/10">
        <h1 className="text-2xl font-semibold text-(--color-error)">{title}</h1>
        <p className="mt-3 text-(--color-foreground-muted)">{message}</p>
        {error.digest ? (
          <p className="mt-3 font-mono text-sm text-(--color-foreground-muted)">
            digest: {error.digest}
          </p>
        ) : null}
        {showDevDetails ? (
          <pre className="mt-4 max-h-56 overflow-auto rounded-xl bg-(--color-surface-low) p-4 text-xs text-(--color-foreground-muted) whitespace-pre-wrap wrap-break-word">
            {error.stack ?? String(error)}
          </pre>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-(--color-primary) px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Volver a intentar
        </button>
      </div>
    </div>
  );
}
