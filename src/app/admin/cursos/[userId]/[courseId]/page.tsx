import { auth } from "@/lib/auth";
import { getCourseById } from "@/lib/courses";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FiActivity } from "react-icons/fi";

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ userId: string; courseId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.rol !== "admin") redirect("/panel");

  const { userId, courseId } = await params;
  const result = await getCourseById(parseInt(courseId));

  if (!result.success || !result.data) {
    redirect(`/admin/cursos/${userId}`);
  }

  const course = result.data;
  const studentName = `${course.user.name} ${course.user.lastname}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumbs
        items={[
          { label: "Administración", href: "/admin" },
          { label: "Gestión de Cursos", href: "/admin/cursos" },
          { label: studentName, href: `/admin/cursos/${userId}` },
          { label: course.name },
        ]}
      />

      <div className="card p-10 flex flex-col items-center justify-center text-center space-y-4 ghost-border border-primary/20 bg-primary/[0.02]">
        <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
          <FiActivity size={32} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            Actividades de {course.user.name}
          </h1>
          <p className="text-lg text-foreground-muted">
            Curso: <span className="font-bold text-primary">{course.name}</span>
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mt-4">
            Modo Administrador
          </div>
        </div>
        
        <div className="pt-6 w-full max-w-md">
          <div className="p-8 border-2 border-dashed border-primary/10 rounded-3xl flex flex-col items-center gap-3">
             <div className="h-2 w-24 bg-primary/5 rounded-full" />
             <p className="text-sm text-foreground-muted font-medium">
               Como administrador, pronto podrás asignar y calificar tareas aquí.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
