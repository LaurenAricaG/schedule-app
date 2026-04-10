"use client";

import { ErrorFallback } from "@/components/error/ErrorFallback";

export default function LoginError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      variant="full"
      title="Error al iniciar sesión"
    />
  );
}
