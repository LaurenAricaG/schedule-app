"use client";

import {
  ErrorFallback,
  type ErrorWithDigest,
} from "@/components/error/ErrorFallback";

export default function AppError({
  error,
  reset,
}: {
  error: ErrorWithDigest;
  reset: () => void;
}) {
  return <ErrorFallback error={error} reset={reset} variant="full" />;
}
