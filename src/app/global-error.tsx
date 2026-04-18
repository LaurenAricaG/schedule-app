"use client";

import {
  ErrorFallback,
  type ErrorWithDigest,
} from "@/components/error/ErrorFallback";
import "@/styles/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: ErrorWithDigest;
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-full antialiased">
        <ErrorFallback
          error={error}
          reset={reset}
          variant="full"
          title="Error en la aplicación"
        />
      </body>
    </html>
  );
}
