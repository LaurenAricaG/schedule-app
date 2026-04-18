import LoginClient from "@/components/login/LoginClient";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-(--color-surface) px-4 py-12">
      <div className="w-full max-w-sm">
        <LoginClient />
      </div>
    </main>
  );
}
