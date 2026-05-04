import { auth } from "@/lib/auth";
import { getCourseById } from "@/lib/courses";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FiActivity } from "react-icons/fi";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { courseId } = await params;
  
  // Obtenemos los datos del curso para saber a quién pertenece
  const result = await getCourseById(parseInt(courseId));
  
  if (!result.success || !result.data) {
    redirect("/panel/cursos");
  }

  const course = result.data;
  
  // Verificamos si el usuario logueado es el dueño del curso
  const isOwner = String(session.user.id) === String(course.user.id);
  const studentName = `${course.user.name} ${course.user.lastname}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumbs
        items={[
          { label: "Panel", href: "/panel" },
          { label: "Mis Cursos", href: "/panel/cursos" },
          { label: course.name },
        ]}
      />

      <div className="card p-10 flex flex-col items-center justify-center text-center space-y-4 ghost-border">
        <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
          <FiActivity size={32} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            {isOwner ? "Mis actividades" : `Actividades de ${course.user.name}`}
          </h1>
          <p className="text-lg text-foreground-muted">
            Curso: <span className="font-bold text-primary">{course.name}</span>
          </p>
          {!isOwner && (
            <p className="text-sm font-medium text-foreground-muted mt-2">
              Estudiante: <span className="text-foreground">{studentName}</span>
            </p>
          )}
        </div>
        
        <div className="pt-6 w-full max-w-md">
          <div className="p-8 border-2 border-dashed border-black/5 rounded-3xl dark:border-white/5 flex flex-col items-center gap-3">
             <div className="h-2 w-24 bg-black/5 dark:bg-white/5 rounded-full" />
             <p className="text-sm text-foreground-muted font-medium">
               Aún no hay actividades registradas para este curso.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
