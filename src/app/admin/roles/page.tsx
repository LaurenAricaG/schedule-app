import RolesList from "@/components/admin/Roles";
import Title from "@/components/admin/Title";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

const Roles = () => {
  return (
    <section className="space-y-6">
      <Title
        title="Gestionar Roles"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Roles" }]}
      />
      <ErrorBoundary
        variant="compact"
        title="No se pudo cargar la tabla de roles"
      >
        <RolesList />
      </ErrorBoundary>
    </section>
  );
};

export default Roles;
