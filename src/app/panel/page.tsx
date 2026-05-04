import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FiBook, FiCalendar } from "react-icons/fi";

/**
 * Página principal del panel del estudiante.
 */
export default async function PanelPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className=" mx-auto space-y-5 py-2">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Hola, {session.user.name} {session.user.lastname}
        </h1>
        <p className="text-lg text-foreground-muted">
          Accede a tus cursos asignados y consulta tu horario académico de forma rápida y sencilla.
        </p>
      </div>
    </div>
  );
}
