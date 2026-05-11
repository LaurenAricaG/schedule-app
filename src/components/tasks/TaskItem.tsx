"use client";

import { useState, useTransition } from "react";
import {
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiBell,
  FiClipboard,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import { Task, TaskStatus } from "@/generated/prisma/client";
import { toggleTaskStatus, deleteTask } from "@/lib/tasks/actions";
import { toast } from "sonner";
import { cn } from "@/utils/cn.utils";

interface TaskItemProps {
  task: Task & { reminders: { type: string; remindAt: Date }[] };
  onEdit: (task: any) => void;
  isAdminView?: boolean;
}

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import Modal from "@/components/ui/Modal";

export function TaskItem({ task, onEdit, isAdminView = false }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isCompleted = task.status === TaskStatus.COMPLETED;

  const isOverdue =
    !isCompleted &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const handleToggle = () => {
    if (isAdminView) return; // Admin cannot toggle task status
    startTransition(async () => {
      const result = await toggleTaskStatus(task.id, task.status);
      if (result.success) {
        toast.success(
          `Tarea ${isCompleted ? "marcada como pendiente" : "completada"}`,
        );
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleConfirmDelete = () => {
    if (isAdminView) return; // Admin cannot delete tasks
    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (result.success) {
        toast.success("Tarea eliminada permanentemente");
        setIsDeleteModalOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div
      className={cn(
        "group grid grid-cols-1 md:grid-cols-[1fr_160px_160px_200px] items-center gap-4 md:gap-6 p-5 sm:p-6 rounded-3xl border transition-all duration-300",
        isCompleted
          ? "bg-surface-low/30 border-transparent grayscale opacity-80"
          : "bg-surface-card border-black/5 dark:border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5",
      )}
    >
      {/* 1. Información Principal e Icono */}
      <div className="flex items-center gap-6 min-w-0">
        <div
          className={cn(
            "hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl shrink-0 transition-transform group-hover:scale-105",
            isCompleted
              ? "bg-foreground/5 text-foreground/40"
              : "bg-primary/10 text-primary shadow-sm",
          )}
        >
          <FiClipboard size={28} />
        </div>

        <div className="grow min-w-0 flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.15em]",
                isCompleted
                  ? "bg-foreground/5 text-foreground/40"
                  : "bg-primary/10 text-primary",
              )}
            >
              Actividad
            </span>
            {isOverdue && (
              <span className="px-2 py-0.5 rounded bg-error/10 text-error text-[9px] font-black uppercase tracking-[0.15em] animate-pulse">
                Atrasada
              </span>
            )}
          </div>
          <h3
            className={cn(
              "text-lg font-bold tracking-tight truncate transition-all",
              isCompleted
                ? "line-through text-foreground-muted/60"
                : "text-foreground",
            )}
          >
            {task.title}
          </h3>
          <p className="text-xs text-foreground-muted line-clamp-1">
            {task.description || "Sin descripción adicional..."}
          </p>
        </div>
      </div>

      {/* 2. Columna: Fecha de Entrega */}
      <div className="hidden md:flex flex-col items-center gap-2 px-4 border-l border-foreground/5">
        <div
          className={cn(
            "flex items-center gap-2 text-sm font-bold",
            isOverdue ? "text-error" : "text-foreground",
          )}
        >
          <FiCalendar size={16} className="text-foreground-muted/40" />
          {new Date(task.dueDate).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          })}
        </div>
      </div>

      {/* 3. Columna: Estado Interactivo */}
      <div className="hidden md:flex flex-col items-center gap-2 px-4 border-l border-foreground/5">
        <button
          onClick={handleToggle}
          disabled={isPending || isAdminView}
          className={cn(
            "group/status relative flex items-center justify-center w-36 h-9 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50",
            isCompleted
              ? "bg-success/10 text-success hover:bg-success hover:text-white"
              : "bg-warning/10 text-warning hover:bg-warning hover:text-white",
            isAdminView &&
              "bg-foreground/5 text-foreground/40 hover:bg-foreground/5 hover:text-foreground/40 cursor-default",
            isAdminView &&
              isCompleted &&
              "bg-success/10 text-success cursor-default hover:bg-success/10 hover:text-success",
            isAdminView &&
              !isCompleted &&
              "bg-warning/10 text-warning cursor-default hover:bg-warning/10 hover:text-warning",
          )}
        >
          {/* Estado Actual (Visible por defecto) */}
          <div className="flex items-center gap-2 transition-opacity duration-200">
            {isCompleted ? (
              <>
                <FiCheckCircle size={14} /> Completada
              </>
            ) : (
              <>
                <FiClock size={14} /> Pendiente
              </>
            )}
          </div>

          {/* Acción al Hover (Visible solo al pasar el mouse si NO es admin) */}
          {!isAdminView && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/status:opacity-100 transition-opacity duration-200 bg-inherit rounded-full">
              {isCompleted ? (
                <span className="flex items-center gap-2">
                  <FiCheckCircle size={14} /> Desmarcar
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FiCheckCircle size={14} /> Completar
                </span>
              )}
            </div>
          )}
        </button>
      </div>

      {/* 4. Acciones */}
      <div
        className={cn(
          "flex items-center justify-center gap-1 md:pl-4 border-t md:border-t-0 md:border-l border-foreground/5 pt-4 md:pt-0",
          isAdminView ? "md:justify-center" : "md:justify-end",
        )}
      >
        <button
          onClick={() => setIsDetailsOpen(true)}
          className="p-3 rounded-2xl text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
          title="Ver detalles"
        >
          <FiEye size={20} />
        </button>

        {!isAdminView && (
          <>
            {/* Status Toggle for Mobile */}
            <button
              onClick={handleToggle}
              disabled={isPending}
              className="md:hidden p-3 rounded-2xl text-foreground-muted hover:text-success hover:bg-success/10 transition-all active:scale-90"
              title={isCompleted ? "Marcar como pendiente" : "Completar"}
            >
              {isCompleted ? (
                <FiCheckCircle size={20} className="text-success" />
              ) : (
                <FiCheckCircle size={20} />
              )}
            </button>
            <button
              className="p-3 rounded-2xl text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
              title="Añadir recordatorio"
            >
              <FiBell size={20} />
            </button>

            <button
              onClick={() => onEdit(task)}
              className="p-3 rounded-2xl text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
              title="Editar"
            >
              <FiEdit2 size={20} />
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isPending}
              className="p-3 rounded-2xl text-foreground-muted hover:text-error hover:bg-error/10 transition-all active:scale-90"
              title="Eliminar"
            >
              <FiTrash2 size={20} />
            </button>
          </>
        )}
      </div>

      {!isAdminView && (
        <ConfirmModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="¿Eliminar esta tarea?"
          description="La tarea será eliminada de forma permanente y no podrá ser recuperada."
          confirmLabel="Eliminar"
          confirmClassName="bg-error hover:opacity-90"
          icon={<FiTrash2 size={16} />}
          iconClassName="bg-error/10 text-error"
          isPending={isPending}
        />
      )}

      {/* Task Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Detalles de la Tarea"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-black text-foreground-muted uppercase tracking-widest mb-1.5">
              Título
            </h4>
            <p className="text-foreground font-bold text-lg leading-tight">
              {task.title}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black text-foreground-muted uppercase tracking-widest mb-1.5">
              Descripción
            </h4>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm">
              {task.description || "No hay descripción proporcionada."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-black text-foreground-muted uppercase tracking-widest mb-1.5">
                Fecha de entrega
              </h4>
              <p className="text-foreground font-medium text-sm">
                {new Date(task.dueDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black text-foreground-muted uppercase tracking-widest mb-1.5">
                Estado
              </h4>
              <span
                className={cn(
                  "inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                  isCompleted
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning",
                )}
              >
                {isCompleted ? "Completada" : "Pendiente"}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
