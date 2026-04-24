// components/admin/Courses/UserCoursesDetail.tsx
"use client";

import { useState, useTransition } from "react";
import { Course, User } from "@/types/definitions";
import { FiPlus, FiEdit2, FiTrash2, FiRotateCcw } from "react-icons/fi";
import { ActionButton } from "@/components/ui/ActionButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "sonner";
import { cn } from "@/utils/cn.utils";
import { deleteCourse, restoreCourse } from "@/lib/courses";

type CoursesByUserResponse = {
  user: Partial<User> | null;
  courses: Course[];
};

/**
 * Componente cliente que muestra el detalle de los cursos de un usuario.
 * Maneja estados locales para los modales de confirmación y transiciones
 * para las Server Actions de eliminar y restaurar cursos.
 */
export default function UserCoursesDetail({ userId, initialData }: { userId: number; initialData: CoursesByUserResponse }) {
  const [confirmOpen, setConfirmOpen] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (courseId: number) => {
    startTransition(async () => {
      const result = await deleteCourse(courseId);
      if (result.success) {
        toast.success("Curso eliminado correctamente");
      } else {
        toast.error(result.error);
      }
      setConfirmOpen(null);
    });
  };

  const handleRestore = (courseId: number) => {
    startTransition(async () => {
      const result = await restoreCourse(courseId);
      if (result.success) {
        toast.success("Curso restaurado correctamente");
      } else {
        toast.error(result.error);
      }
    });
  };

  const activeCourses = initialData.courses.filter((c) => !c.deletedAt);

  return (
    <div className="space-y-6">
      {/* Header con nombre del usuario */}
      <p className=" text-sm text-foreground-muted">
        Gestiona los cursos de{" "}
        {initialData.user ? `${initialData.user.name} ${initialData.user.lastname}` : "este usuario"}
      </p>

      {/* Header con botón crear */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground-muted">
          Total: {activeCourses.length} curso
          {activeCourses.length !== 1 ? "s" : ""}
        </span>
        <button className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
          <FiPlus size={14} />
          Nuevo curso
        </button>
      </div>

      {/* Tabla de cursos */}
      <div className="rounded-2xl border border-black/8 bg-surface-card p-6 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="border-b border-black/8 dark:border-white/10">
            <tr>
              <th className="pb-4 text-left font-semibold text-foreground">
                Curso
              </th>
              <th className="pb-4 text-left font-semibold text-foreground">
                Profesor
              </th>
              <th className="pb-4 text-center font-semibold text-foreground">
                Estado
              </th>
              <th className="pb-4 text-right font-semibold text-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/8 dark:divide-white/10">
            {initialData.courses.map((course) => {
              const deleted = course.deletedAt !== null;
              return (
                <tr
                  key={course.id}
                  className={cn(
                    "hover:bg-surface-low/50 transition-colors",
                    deleted && "opacity-60",
                  )}
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: course.color || "#6366f1",
                        }}
                      />
                      <span className="font-medium text-foreground">
                        {course.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-foreground-muted">
                    {course.teacher}
                  </td>
                  <td className="py-4 text-center">
                    <StatusBadge active={!deleted} />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-1">
                      <ActionButton onClick={() => {}}>
                        <FiEdit2 size={13} />
                      </ActionButton>

                      {deleted ? (
                        <ActionButton
                          onClick={() => handleRestore(course.id)}
                          className="text-success hover:bg-success/10"
                        >
                          <FiRotateCcw size={13} />
                        </ActionButton>
                      ) : (
                        <ActionButton
                          onClick={() => setConfirmOpen(course.id)}
                          className="text-error hover:bg-error/10"
                        >
                          <FiTrash2 size={13} />
                        </ActionButton>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      {confirmOpen !== null && (
        <ConfirmModal
          open={true}
          onClose={() => setConfirmOpen(null)}
          onConfirm={() => handleDelete(confirmOpen)}
          title="¿Eliminar curso?"
          description={`El curso "${initialData.courses.find((c) => c.id === confirmOpen)?.name}" será marcado como inactivo.`}
          confirmLabel="Eliminar"
          confirmClassName="bg-error hover:opacity-90"
          icon={<FiTrash2 size={16} />}
          iconClassName="bg-error/10 text-error"
          isPending={isPending}
        />
      )}
    </div>
  );
}
