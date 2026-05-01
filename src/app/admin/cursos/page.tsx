import { Suspense } from "react";
import UsersCoursesList from "@/components/admin/Courses";
import Title from "@/components/ui/Title";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { UsersListSkeleton } from "@/components/ui/Skeletons";

/**
 * Página principal de administración de cursos.
 * Muestra la lista de usuarios y la cantidad de cursos que tienen.
 */
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  return (
    <section className="space-y-6">
      {/* Navegación de migas de pan */}
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Cursos" }]}
      />
      <Title title="Gestionar Cursos" />

      {/* Manejador de errores para la lista de usuarios/cursos */}
      <ErrorBoundary variant="compact" title="No se pudo cargar los usuarios">
        <Suspense key={currentPage} fallback={<UsersListSkeleton />}>
          <UsersCoursesList page={currentPage} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
