import Pagination from "@/components/ui/Pagination";
import Title from "@/components/ui/Title";
import { getUsers } from "@/lib/users";
import { UserWithRolDTO } from "@/types/definitions";
import { FiPlus } from "react-icons/fi";
import TableUsers from "./TableUsers";

interface UsersListProps {
  page?: number;
}

/**
 * Componente que muestra una lista de usuarios.
 * Es un Server Component así­ncrono que obtiene sus propios datos.
 */
export default async function UsersList({ page = 1 }: UsersListProps) {
  const limit = 5;
  const result = await getUsers(page, limit);

  const initialUsers: UserWithRolDTO[] = result.success
    ? (result.data?.users ?? [])
    : [];
  const totalItems = result.success ? (result.data?.total ?? 0) : 0;
  const totalPages = Math.ceil(totalItems / limit);

  console.log("Usuarios obtenidos:", initialUsers);
  if (!initialUsers.length) {
    return (
      <p className="py-10 text-center text-sm text-foreground-muted">
        No hay usuarios disponibles.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <Title title="Gestionar Usuarios" />
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 ghost-border cursor-pointer">
            <FiPlus size={18} /> Nuevo usuario
          </button>
        </div>
      </div>
      <TableUsers users={initialUsers} />

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        totalItems={totalItems}
        itemsPerPage={limit}
        itemName="usuarios"
      />
    </div>
  );
}
