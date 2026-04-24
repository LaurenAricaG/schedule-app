import { Suspense } from "react";
import RolesList from "@/components/admin/Roles";
import Title from "@/components/ui/Title";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RolesSkeleton } from "@/components/ui/Skeletons";

/**
 * Página principal de administración de roles.
 * Utiliza Suspense para cargar asíncronamente la lista de roles
 * mientras muestra un skeleton de carga.
 */
export default function RolesPage() {
  return (
    <section className="space-y-6">
      {/* Navegación de migas de pan */}
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Roles" }]}
      />

      <Title title="Gestionar Roles" />
      
      {/* Manejador de errores encapsulado para la lista de roles */}
      <ErrorBoundary
        variant="compact"
        title="No se pudo cargar la tabla de roles"
      >
        <Suspense fallback={<RolesSkeleton />}>
          <RolesList />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
