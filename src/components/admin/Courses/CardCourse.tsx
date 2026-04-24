// components/admin/Courses/CardCourse.tsx
"use client";

import { useState, useTransition } from "react";
import { Course } from "@/types/definitions";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ActionButton } from "@/components/ui/ActionButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FiEdit2, FiTrash2, FiRotateCcw } from "react-icons/fi";
import { toast } from "sonner";
import { cn } from "@/utils/cn.utils";
import { deleteCourse } from "@/lib/courses";

type CardCourseProps = {
  course: Course;
  onSuccess: () => void;
};

export default function CardCourse({ course, onSuccess }: CardCourseProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleted = course.deletedAt !== null;

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCourse(course.id);
      if (result.success) {
        toast.success("Curso eliminado correctamente");
        onSuccess();
      } else {
        toast.error(result.error);
      }
      setConfirmOpen(false);
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
            className="h-10 w-10 rounded-lg"
            style={{ backgroundColor: course.color || "#6366f1" }}
          />

          <div className="flex gap-1">
            <ActionButton onClick={() => {}}>
              <FiEdit2 size={13} />
            </ActionButton>

            {deleted ? (
              <ActionButton
                onClick={() => {}}
                className="text-success hover:bg-success/10"
              >
                <FiRotateCcw size={13} />
              </ActionButton>
            ) : (
              <ActionButton
                onClick={() => setConfirmOpen(true)}
                className="text-error hover:bg-error/10"
              >
                <FiTrash2 size={13} />
              </ActionButton>
            )}
          </div>
        </div>

        {/* Body */}
        <h3 className="text-base font-semibold capitalize text-foreground">
          {course.name}
        </h3>

        <p className="mt-2 mb-6 text-sm text-foreground-muted">
          {course.teacher}
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
            CURSO
          </span>
          <StatusBadge active={!deleted} />
        </div>
      </article>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminar curso?"
        description={`El curso "${course.name}" será marcado como inactivo.`}
        confirmLabel="Eliminar"
        confirmClassName="bg-error hover:opacity-90"
        icon={<FiTrash2 size={16} />}
        iconClassName="bg-error/10 text-error"
        isPending={isPending}
      />
    </>
  );
}
