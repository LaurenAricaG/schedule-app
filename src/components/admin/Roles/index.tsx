import { getRoles } from "@/lib/roles";
import CardRoles from "./CardRoles";

const RolesList = async () => {
  const result = await getRoles();
  const roles = result.success ? (result.data ?? []) : [];

  if (!roles.length) {
    return (
      <p className="py-10 text-center text-sm text-foreground-muted">
        No hay roles disponibles.
      </p>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {roles.map((role) => (
        <CardRoles key={role.id} role={role} />
      ))}
    </section>
  );
};

export default RolesList;
