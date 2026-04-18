"use client";

import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import LoginForm from "./LoginForm";

export default function LoginClient() {
  return (
    <ErrorBoundary
      variant="embedded"
      title="Error al cargar el inicio de sesión"
    >
      <LoginForm />
    </ErrorBoundary>
  );
}
