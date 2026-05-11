import { Suspense } from "react";
import UserCoursesDetail from "@/components/Courses/UserCoursesDetail";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getCoursesByUser } from "@/lib/courses";
import { UserCoursesDetailSkeleton } from "@/components/ui/Skeletons";

/**
 * Componente asíncrono para cargar los cursos del usuario.
 */
async function CoursesLoader({ userId, page }: { userId: number; page: number }) {
  const result = await getCoursesByUser(userId, page, 6);
  const initialData = result.success
    ? result.data
    : { user: null, courses: [], total: 0 };
  return <UserCoursesDetail userId={userId} initialData={initialData} page={page} isAdmin={true} />;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/**
 * Página de detalle de cursos por usuario.
 */
export default async function UserCoursesPage(props: {
  params: Promise<{ userId: string }>;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const userId = parseInt(params.userId);
  const resolvedSearchParams = await props.searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  return (
    <section className="space-y-6">
      {/* Navegación de migas de pan */}
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Cursos", href: "/admin/cursos" },
          { label: "Lista de cursos" },
        ]}
      />
      {/* Manejador de errores para el detalle de cursos */}
      <ErrorBoundary variant="compact" title="No se pudieron cargar los cursos">
        <Suspense key={currentPage} fallback={<UserCoursesDetailSkeleton isAdmin={true} />}>
          <CoursesLoader userId={userId} page={currentPage} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
