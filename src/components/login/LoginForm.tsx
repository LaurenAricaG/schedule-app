"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="w-full rounded-2xl border border-black/10 bg-(--color-surface-card) p-8 shadow-sm dark:border-white/10">
      <h1 className="mb-8 text-xl font-semibold tracking-tight text-(--color-foreground)">
        Iniciar sesión
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="login-username"
            className="block text-sm text-(--color-foreground-muted)"
          >
            Usuario
          </label>
          <input
            id="login-username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="w-full rounded-xl border border-black/10 bg-(--color-surface) px-3 py-2.5 text-sm text-(--color-foreground) outline-none transition-colors focus:border-(--color-primary) dark:border-white/10"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="login-password"
            className="block text-sm text-(--color-foreground-muted)"
          >
            Contraseña
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-black/10 bg-(--color-surface) px-3 py-2.5 text-sm text-(--color-foreground) outline-none transition-colors focus:border-(--color-primary) dark:border-white/10"
          />
        </div>

        {error ? (
          <p className="text-sm font-medium text-(--color-error)" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-(--color-primary) py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
