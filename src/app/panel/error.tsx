"use client";

import { ErrorFallback } from "@/components/error/ErrorFallback";

export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      variant="full"
      title="No se pudo cargar esta página"
    />
  );
}
