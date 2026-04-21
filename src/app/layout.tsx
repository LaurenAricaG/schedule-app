import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { cn } from "@/utils/cn.utils";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schedule App",
  description: "Gestión de horarios y cursos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        geistSans.variable,
        geistMono.variable,
        "h-full antialiased",
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <Toaster
            toastOptions={{
              style: {
                background: "var(--surface-card)",
                border:
                  "1px solid color-mix(in srgb, var(--on-surface) 10%, transparent)",
                color: "var(--on-surface)",
                fontSize: "14px",
              },
              classNames: {
                success: "!text-[var(--success)]",
                error: "!text-[var(--error)]",
                warning: "!text-[var(--warning)]",
                info: "!text-[var(--info)]",
                description: "!text-[var(--on-surface-variant)]",
                title: "!font-medium",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
