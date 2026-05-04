import LogoutButton from "@/components/ui/LogoutButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FiCalendar } from "react-icons/fi";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { BiLogOut } from "react-icons/bi";
import { cn } from "@/utils/cn.utils";
import PanelNavbar from "@/components/panel/PanelNavbar";
import PanelMobileNav from "@/components/panel/PanelMobileNav";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.rol === "admin") redirect("/admin");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-low/30 transition-colors duration-300">
      <header className="bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-50 dark:bg-surface-card/80 dark:border-white/5">
        <div className="px-4 sm:px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link
              href="/panel"
              className="flex items-center gap-2 transition-opacity"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <FiCalendar size={18} />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                Mi Panel
              </h1>
            </Link>

            <PanelNavbar />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton
              className={cn("w-auto flex items-center justify-center p-2.5 sm:px-4 sm:py-2 rounded-full sm:rounded-xl transition-all")}
            >
              <BiLogOut size={18} />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </LogoutButton>
          </div>
        </div>
      </header>
      
      <main className="p-4 sm:p-8 max-w-7xl mx-auto mb-20 md:mb-0">
        {children}
      </main>

      <PanelMobileNav />
    </div>
  );
}
