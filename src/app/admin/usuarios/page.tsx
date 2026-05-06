import UsersList from "@/components/admin/Users";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/**
 * Página principal de administración de usuarios.
 * Muestra la lista de usuarios con paginación y opciones para gestionar cada usuario.
 */
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function UsersPage({
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
        items={[{ label: "Admin", href: "/admin" }, { label: "Usuarios" }]}
      />

      {/* Manejador de errores encapsulado para la lista de usuarios */}
      <ErrorBoundary
        variant="compact"
        title="No se pudo cargar la lista de usuarios"
      >
        <UsersList page={currentPage} />
      </ErrorBoundary>
    </section>
  );
}
