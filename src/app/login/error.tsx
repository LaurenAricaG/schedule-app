"use client";

import {
  ErrorFallback,
  type ErrorWithDigest,
} from "@/components/error/ErrorFallback";

export default function LoginError({
  error,
  reset,
}: {
  error: ErrorWithDigest;
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
