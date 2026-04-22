"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineSchedule } from "react-icons/ai";
import ThemeToggle from "../theme/ThemeToggle";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Usuario o contraseña incorrectos");
      return;
    }

    router.push("/");
  }
  // feat: Rediseñar formulario de inicio de sesión con nuevos estilos y funcionalidad de mostrar/ocultar contraseña
  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-black/8 bg-surface-card p-8 shadow-sm dark:border-white/10">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
          <AiOutlineSchedule size={30} />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Accede a tu cuenta para continuar
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-foreground-muted mb-2">
            Usuario
          </label>
          <div className="relative">
            <FiUser
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted/40"
            />
            <input
              id="login-username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-black/8 bg-surface px-3 py-3 pl-10 text-sm text-foreground outline-none transition-colors focus:border-primary dark:border-white/10"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Contraseña
            </label>
          </div>
          <div className="relative">
            <FiLock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted/40"
            />
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-black/8 bg-surface px-3 py-3 pl-10 pr-10 text-sm text-foreground outline-none transition-colors focus:border-primary dark:border-white/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted/40 hover:text-foreground-muted transition-colors"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-error/10 px-4 py-2.5 text-sm text-error">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:300ms]" />
            </>
          ) : (
            <>
              Ingresar
              <span>→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
