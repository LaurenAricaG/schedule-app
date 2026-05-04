"use client";

import { useState, useTransition } from "react";
import { Course } from "@/types/definitions";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActionButton } from "@/components/ui/ActionButton";
import { FiEdit2, FiTrash2, FiRotateCcw, FiBook } from "react-icons/fi";
import { toast } from "sonner";
import { cn } from "@/utils/cn.utils";
import { deleteCourse, restoreCourse } from "@/lib/courses";
import Link from "next/link";

type CardCourseProps = {
  course: Course;
  onSuccess: () => void;
  isAdmin?: boolean;
};

export default function CardCourse({ course, onSuccess, isAdmin = false }: CardCourseProps) {
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

  const handleRestore = () => {
    startTransition(async () => {
      const result = await restoreCourse(course.id);
      if (result.success) {
        toast.success("Curso activado correctamente");
        onSuccess();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <>
      <article
        className={cn(
          "flex flex-col rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden",
          isPending && "opacity-50 pointer-events-none",
          deleted
            ? "border-error/25 bg-error/5 dark:border-error/20"
            : "border-transparent bg-surface-card dark:bg-surface-card",
        )}
        style={
          !deleted
            ? ({ "--course-color": course.color || "#6366f1" } as React.CSSProperties)
            : undefined
        }
      >
        {!deleted && (
          <div 
            className="absolute top-0 left-0 w-full h-1" 
            style={{ backgroundColor: "var(--course-color)", opacity: 0.8 }} 
          />
        )}
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              deleted && "bg-error/10 text-error dark:bg-error/15"
            )}
            style={!deleted ? { 
              backgroundColor: "color-mix(in srgb, var(--course-color) 15%, transparent)",
              color: "var(--course-color)" 
            } : undefined}
          >
            <FiBook size={20} />
          </span>

          {isAdmin && (
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
                  onClick={() => setConfirmOpen(true)}
                  className="text-error hover:bg-error/10"
                >
                  <FiTrash2 size={13} />
                </ActionButton>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <h3 
          className={cn(
            "text-lg font-bold capitalize leading-tight",
            deleted ? "text-foreground/55" : "text-foreground"
          )}
        >
          {course.name}
        </h3>

        <p 
          className={cn(
            "mt-2 mb-6 text-sm",
            deleted ? "text-foreground-muted/55" : "text-foreground-muted"
          )}
        >
          {deleted ? "Este curso está inactivo y puede restaurarse." : course.teacher}
        </p>

        {/* Footer */}
        <div 
          className={cn(
            "mt-auto flex items-center justify-between border-t pt-4",
            deleted ? "border-error/10 dark:border-error/15" : "border-black/6 dark:border-white/8"
          )}
        >
          <StatusBadge active={!deleted} />
          <Link
            href={
              isAdmin
                ? `/admin/cursos/${course.userId}/${course.id}`
                : `/panel/cursos/${course.id}`
            }
          >
            <button
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
                deleted &&
                  "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-container dark:hover:bg-primary/30",
              )}
              style={
                !deleted
                  ? {
                      backgroundColor:
                        "color-mix(in srgb, var(--course-color) 10%, transparent)",
                      color: "var(--course-color)",
                    }
                  : undefined
              }
            >
              Gestionar
            </button>
          </Link>
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
