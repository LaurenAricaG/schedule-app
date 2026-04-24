"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { deleteRole, restoreRole } from "@/lib/roles";
import { Role } from "@/types/definitions";
import { cn } from "@/utils/cn.utils";
import { useState, useTransition } from "react";
import { FaUserCog, FaUserGraduate } from "react-icons/fa";
import { toast } from "sonner";
import {
  FiEdit2,
  FiTrash2,
  FiRotateCcw,
  FiBookOpen,
  FiUsers,
  FiUserCheck,
} from "react-icons/fi";

const ICON_MAP: Record<string, React.ElementType> = {
  admin: FaUserCog,
  profesor: FiBookOpen,
  estudiante: FaUserGraduate,
  apoderado: FiUserCheck,
};

/**
 * Componente cliente que muestra la información de un rol específico en formato de tarjeta.
 * Incluye acciones para editar, eliminar (lógico) y restaurar el rol.
 * Las modificaciones utilizan useTransition para mostrar un estado de carga.
 *
 * @param {Role} role - Objeto con la información del rol a mostrar.
 */
const CardRoles = ({
  role,
}: {
  role: Role;
}) => {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const Icon = ICON_MAP[role.rol] ?? FiUsers;
  const deleted = role.deletedAt !== null;
  const isAdmin = role.rol === "admin";

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteRole(role.id);
      if (result.success) {
        toast.success("Rol eliminado correctamente");
      } else {
        toast.error(result.error);
      }
      setConfirmOpen(false);
    });
  };

  const handleRestore = () => {
    startTransition(async () => {
      const result = await restoreRole(role.id);
      if (result.success) {
        toast.success("Rol restaurado correctamente");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <article
        className={cn(
          "flex flex-col rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
          isPending && "opacity-50 pointer-events-none",
          deleted
            ? "border-error/25 bg-error/5 dark:border-error/20"
            : "border-black/6 bg-surface-card dark:border-white/8 dark:bg-surface-card",
        )}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              deleted
                ? "bg-error/10 text-error dark:bg-error/15"
                : "bg-primary/10 text-primary",
            )}
          >
            <Icon size={17} />
          </span>

          <div className="flex gap-1">
            <ActionButton onClick={() => {}}>
              <FiEdit2 size={13} />
            </ActionButton>

            {deleted ? (
              <ActionButton
                onClick={handleRestore}
                className="text-success hover:bg-success/10"
              >
                <FiRotateCcw size={13} />
              </ActionButton>
            ) : (
              <ActionButton
                onClick={() => {
                  if (isAdmin) {
                    toast.warning(
                      "El rol de administrador no puede eliminarse.",
                    );
                    return;
                  }
                  setConfirmOpen(true);
                }}
                className={cn(
                  "text-error hover:bg-error/10",
                  isAdmin && "opacity-40 cursor-not-allowed",
                )}
              >
                <FiTrash2 size={13} />
              </ActionButton>
            )}
          </div>
        </div>

        {/* Body */}
        <h3
          className={cn(
            "text-base font-semibold capitalize leading-snug",
            deleted ? "text-foreground/55" : "text-foreground",
          )}
        >
          {role.rol}
        </h3>

        <p
          className={cn(
            "mt-2 mb-6 text-sm leading-relaxed",
            deleted ? "text-foreground-muted/55" : "text-foreground-muted",
          )}
        >
          {deleted
            ? "Este rol está inactivo y puede restaurarse."
            : `Gestión y acceso del perfil ${role.rol}.`}
        </p>

        {/* Footer */}
        <div
          className={cn(
            "mt-auto flex items-center justify-between border-t pt-4",
            deleted
              ? "border-error/10 dark:border-error/15"
              : "border-black/6 dark:border-white/8",
          )}
        >
          <span className="text-[11px] font-medium tracking-widest text-foreground-muted/55">
            SISTEMA
          </span>
          <StatusBadge active={!deleted} />
        </div>
      </article>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar rol"
        description={`El rol será marcado como inactivo.`}
        confirmLabel="Eliminar"
        confirmClassName="bg-error hover:opacity-90"
        icon={<FiTrash2 size={16} />}
        iconClassName="bg-error/10 text-error"
        isPending={isPending}
      />
    </>
  );
};

export default CardRoles;
