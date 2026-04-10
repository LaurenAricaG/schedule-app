import LogoutButton from "@/components/ui/LogoutButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.rol === "admin") redirect("/admin");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0">
        <div className="px-8 py-4 flex justify-between items-center">
          <h1 className="text-lg font-medium">Mi Panel</h1>
          <div className="w-32">
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
