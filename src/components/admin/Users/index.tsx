import Pagination from "@/components/ui/Pagination";
import Title from "@/components/ui/Title";
import { getUsers, getApoderados } from "@/lib/users";
import { getRoles } from "@/lib/roles";
import { UserWithRolDTO } from "@/types/definitions";
import TableUsers from "./TableUsers";
import { UsersActions } from "./UsersActions";

interface UsersListProps {
  page?: number;
}

export default async function UsersList({ page = 1 }: UsersListProps) {
  const limit = 5;
  const [usersResult, rolesResult, apoderadosResult] = await Promise.all([
    getUsers(page, limit),
    getRoles(),
    getApoderados()
  ]);

  const initialUsers: UserWithRolDTO[] = usersResult.success
    ? (usersResult.data?.users ?? [])
    : [];
  const roles = rolesResult.success ? (rolesResult.data ?? []) : [];
  const apoderados = apoderadosResult.success ? (apoderadosResult.data ?? []) : [];
  
  const totalItems = usersResult.success ? (usersResult.data?.total ?? 0) : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <Title title="Gestionar Usuarios" />
        <UsersActions roles={roles} apoderados={apoderados} />
      </div>

      {!initialUsers.length ? (
        <div className="py-20 text-center border-2 border-dashed border-black/5 dark:border-white/5 rounded-2xl">
          <p className="text-sm text-foreground-muted">
            No hay usuarios registrados en este momento.
          </p>
        </div>
      ) : (
        <>
          <TableUsers users={initialUsers} roles={roles} apoderados={apoderados} />
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={limit}
            itemName="usuarios"
          />
        </>
      )}
    </div>
  );
}
