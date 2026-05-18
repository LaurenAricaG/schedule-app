"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import Modal from "@/components/ui/Modal";
import { deleteUser, restoreUser } from "@/lib/users/actions";
import { UserWithRolDTO } from "@/types/definitions";
import { cn } from "@/utils/cn.utils";
import { useState, useTransition } from "react";
import { FiEdit2, FiRotateCcw, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { UserForm } from "./UserForm";

type RoleName = "admin" | "estudiante" | "docente" | "apoderado";

export const ROLE_COLORS: Record<RoleName, string> = {
  admin: "bg-role-admin/10 text-role-admin",
  estudiante: "bg-role-estudiante/10 text-role-estudiante",
  docente: "bg-role-docente/10 text-role-docente",
  apoderado: "bg-role-apoderado/10 text-role-apoderado",
};

function UserAvatar({
  name,
  lastname,
}: {
  name: string;
  lastname: string | null;
}) {
  const getInitials = () => {
    const firstName = name.trim().split(" ");

    if (lastname) return `${firstName[0][0]}${lastname[0]}`.toUpperCase();
    if (firstName.length >= 2)
      return `${firstName[0][0]}${firstName[1][0]}`.toUpperCase();

    return firstName[0][0].toUpperCase();
  };

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-avatar/20 text-sm font-semibold text-avatar">
      <span className="font-bold">{getInitials()}</span>
    </div>
  );
}

const TableUsers = ({
  users,
  roles,
  apoderados,
}: {
  users: UserWithRolDTO[];
  roles: any[];
  apoderados: any[];
}) => {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRolDTO | null>(null);

  const handleDelete = () => {
    if (!selectedUser) return;

    startTransition(async () => {
      const result = await deleteUser(selectedUser.id);
      if (result.success) {
        toast.success("Usuario eliminado correctamente");
      } else {
        toast.error(result.error);
      }
      setConfirmOpen(false);
    });
  };

  const handleRestore = (user: UserWithRolDTO) => {
    startTransition(async () => {
      const result = await restoreUser(user.id);
      if (result.success) {
        toast.success("Usuario restaurado correctamente");
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleEdit = (user: UserWithRolDTO) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  return (
    <>
      <div className="card ghost-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/8 dark:border-white/10">
                <th className="px-6 py-4 text-left text-xs uppercase text-foreground-muted">
                  NOMBRES
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase text-foreground-muted">
                  EMAIL
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase text-foreground-muted">
                  USUARIO
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase text-foreground-muted">
                  ROL
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase text-foreground-muted">
                  ESTADO
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase text-foreground-muted">
                  ACCIONES
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-black/5 dark:border-white/5 hover:bg-black/2 dark:hover:bg-white/2"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.name} lastname={user.lastname} />
                      <span className="font-semibold">
                        {user.name} {user.lastname}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-3 text-foreground-muted">
                    {user.email}
                  </td>

                  <td className="px-6 py-3 text-foreground-muted">
                    {user.username}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                        ROLE_COLORS[user.rol.rol as keyof typeof ROLE_COLORS] ??
                          "bg-surface-low text-foreground-muted",
                      )}
                    >
                      {user.rol.rol}
                    </span>
                  </td>

                  <td className="px-6 py-3">
                    {user.status ? (
                      <span className="text-success text-xs bg-success/10 font-semibold px-3 py-1 rounded-full">
                        Activo
                      </span>
                    ) : (
                      <span className="text-error bg-error/10 text-xs font-semibold px-3 py-1 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <ActionButton onClick={() => handleEdit(user)}>
                        <FiEdit2 size={13} />
                      </ActionButton>

                      {user.status ? (
                        <ActionButton
                          onClick={() => {
                            if (user.rol.rol === "admin") {
                              toast.warning(
                                "El administrador no puede eliminarse",
                              );
                              return;
                            }
                            setSelectedUser(user);
                            setConfirmOpen(true);
                          }}
                          className={cn(
                            "text-error hover:bg-error/10",
                            user.rol.rol === "admin" &&
                              "opacity-40 cursor-not-allowed",
                          )}
                        >
                          <FiTrash2 size={13} />
                        </ActionButton>
                      ) : (
                        <ActionButton
                          onClick={() => handleRestore(user)}
                          className="text-success hover:bg-success/10"
                        >
                          <FiRotateCcw size={13} />
                        </ActionButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Eliminar usuario"
          description="El usuario será marcado como inactivo."
          confirmLabel="Eliminar"
          confirmClassName="bg-error hover:opacity-90"
          icon={<FiTrash2 size={16} />}
          iconClassName="bg-error/10 text-error"
          isPending={isPending}
        />
      </div>

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar Usuario"
        maxWidth="max-w-2xl"
      >
        <UserForm
          initialData={selectedUser}
          roles={roles}
          apoderados={apoderados}
          onClose={() => setEditOpen(false)}
        />
      </Modal>
    </>
  );
};

export default TableUsers;
