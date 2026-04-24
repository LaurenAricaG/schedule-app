import { Suspense } from "react";
import UserCoursesDetail from "@/components/admin/Courses/UserCoursesDetail";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Title from "@/components/ui/Title";
import { getCoursesByUser } from "@/lib/courses";
import { UserCoursesDetailSkeleton } from "@/components/ui/Skeletons";

/**
 * Componente asíncrono para cargar los cursos del usuario.
 */
async function CoursesLoader({ userId }: { userId: number }) {
  const result = await getCoursesByUser(userId);
  const initialData = result.success ? result.data : { user: null, courses: [] };
  return <UserCoursesDetail userId={userId} initialData={initialData} />;
}

/**
 * Página de detalle de cursos por usuario.
 */
export default async function UserCoursesPage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const userId = parseInt(params.userId);

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        {/* Navegación de migas de pan */}
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Cursos", href: "/admin/cursos" },
            { label: "Lista de cursos" },
          ]}
        />
        <Title title="Cursos por usuario" />
      </div>
      
      {/* Manejador de errores para el detalle de cursos */}
      <ErrorBoundary variant="compact" title="No se pudieron cargar los cursos">
        <Suspense fallback={<UserCoursesDetailSkeleton />}>
          <CoursesLoader userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
