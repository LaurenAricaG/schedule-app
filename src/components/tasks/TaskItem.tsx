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
import { Task, TaskStatus, ReminderType } from "@/generated/prisma/client";
import {
  toggleTaskStatus,
  deleteTask,
  addReminder,
  updateReminder,
  deleteReminderAction,
} from "@/lib/tasks/actions";
import { toast } from "sonner";
import { cn } from "@/utils/cn.utils";

interface TaskItemProps {
  task: Task & { reminders: { id: number; type: string; remindAt: Date }[] };
  onEdit: (task: any) => void;
  isAdminView?: boolean;
}

import { ConfirmModal } from "@/components/ui/ConfirmModal";
import Modal from "@/components/ui/Modal";
import { InputField, SelectField } from "@/components/ui/Form/Fields";

export function TaskItem({ task, onEdit, isAdminView = false }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<number | null>(
    null,
  );
  const [reminderType, setReminderType] = useState<ReminderType | "">("");
  const [remindAt, setRemindAt] = useState("");
  const isCompleted = task.status === TaskStatus.COMPLETED;

  const isOverdue =
    !isCompleted &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remindAt) {
      toast.error("Por favor ingresa la fecha y hora del recordatorio.");
      return;
    }
    if (!reminderType) {
      toast.error("Selecciona un tipo de recordatorio.");
      return;
    }

    const reminderDate = new Date(remindAt);
    const dueDate = new Date(task.dueDate);
    const maxDate = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000);
    const now = new Date();

    if (reminderDate < now && !editingReminderId) {
      toast.error("La fecha del recordatorio no puede estar en el pasado.");
      return;
    }

    if (reminderDate > maxDate) {
      toast.info(
        "Solo se puede registrar el recordatorio hasta el mediodía del día límite permitido.",
      );
      return;
    }

    startTransition(async () => {
      if (editingReminderId) {
        const result = await updateReminder(editingReminderId, {
          type: reminderType,
          remindAt: reminderDate,
        });
        if (result.success) {
          toast.success("Recordatorio actualizado");
          setIsReminderModalOpen(false);
          setEditingReminderId(null);
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await addReminder(task.id, {
          type: reminderType,
          remindAt: reminderDate,
        });
        if (result.success) {
          toast.success("Recordatorio agregado");
          setIsReminderModalOpen(false);
          setRemindAt("");
        } else {
          toast.error(result.error);
        }
      }
    });
  };

  const handleDeleteReminder = (id: number) => {
    startTransition(async () => {
      const result = await deleteReminderAction(id);
      if (result.success) {
        toast.success("Recordatorio eliminado");
      } else {
        toast.error(result.error);
      }
    });
  };

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
              onClick={() => {
                if (isCompleted) {
                  toast.error(
                    "No se puede añadir un recordatorio a una tarea completada.",
                  );
                  return;
                }
                if (isOverdue) {
                  toast.error(
                    "No se puede añadir un recordatorio a una tarea atrasada.",
                  );
                  return;
                }
                setEditingReminderId(null);
                setReminderType("");
                setRemindAt("");
                setIsReminderModalOpen(true);
              }}
              className="relative p-3 rounded-2xl text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
              title="Añadir recordatorio"
            >
              <FiBell size={20} />
              {task.reminders && task.reminders.length > 0 && (
                <span className="absolute top-1.5 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[7px] font-bold text-white ring-2 ring-surface-card z-10 pointer-events-none group-hover:bg-primary group-hover:text-white">
                  {task.reminders.length}
                </span>
              )}
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
          {/* Main Info Card */}
          <div className="p-5 rounded-2xl bg-surface-card border border-black/5 dark:border-white/5 space-y-4 shadow-sm">
            <div>
              <h4 className="flex items-center gap-2 text-[10px] font-black text-foreground-muted/60 uppercase tracking-widest mb-2">
                <FiClipboard size={12} /> Título
              </h4>
              <p className="text-foreground font-bold text-xl leading-tight wrap-break-word overflow-hidden">
                {task.title}
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <h4 className="flex items-center gap-2 text-[10px] font-black text-foreground-muted/60 uppercase tracking-widest mb-2">
                <FiEdit2 size={12} /> Descripción
              </h4>
              <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed text-sm wrap-break-word overflow-hidden">
                {task.description || (
                  <span className="italic opacity-60 text-foreground-muted">
                    No hay descripción proporcionada.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 sm:p-4 rounded-2xl bg-surface-card border border-black/5 dark:border-white/5 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <FiCalendar size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[10px] font-black text-foreground-muted/60 uppercase tracking-widest mb-0.5">
                  Entrega
                </h4>
                <p className="text-foreground font-bold text-sm truncate">
                  {new Date(task.dueDate).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-surface-card border border-black/5 dark:border-white/5 flex items-center gap-3 shadow-sm">
              <div
                className={cn(
                  "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center",
                  isCompleted
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning",
                )}
              >
                {isCompleted ? (
                  <FiCheckCircle size={18} />
                ) : (
                  <FiClock size={18} />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[10px] font-black text-foreground-muted/60 uppercase tracking-widest mb-0.5">
                  Estado
                </h4>
                <span
                  className={cn(
                    "text-sm font-bold truncate",
                    isCompleted ? "text-success" : "text-warning",
                  )}
                >
                  {isCompleted ? "Completada" : "Pendiente"}
                </span>
              </div>
            </div>
          </div>

          {/* Reminders Section */}
          <div className="p-5 rounded-2xl bg-surface-card border border-black/5 dark:border-white/5 shadow-sm">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-foreground-muted/60 uppercase tracking-widest mb-4">
              <FiBell size={12} /> Recordatorios
            </h4>

            {task.reminders && task.reminders.length > 0 ? (
              <ul className="space-y-3">
                {task.reminders.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-low border border-black/5 dark:border-white/5 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
                  >
                    <div className="flex items-center gap-3 text-foreground">
                      <div className="bg-primary/10 h-8 w-8 rounded-lg flex items-center justify-center text-primary shadow-sm">
                        <FiBell size={14} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-xs uppercase tracking-wide truncate">
                          {r.type}
                        </span>
                        <span className="text-foreground-muted text-[11px] font-medium truncate">
                          {new Date(r.remindAt).toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    {!isAdminView && (
                      <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingReminderId(r.id);
                            setReminderType(r.type as ReminderType);
                            const dateObj = new Date(r.remindAt);
                            dateObj.setMinutes(
                              dateObj.getMinutes() -
                                dateObj.getTimezoneOffset(),
                            );
                            setRemindAt(dateObj.toISOString().slice(0, 16));
                            setIsDetailsOpen(false);
                            setIsReminderModalOpen(true);
                          }}
                          className="p-2 rounded-lg text-foreground-muted hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Editar recordatorio"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteReminder(r.id)}
                          disabled={isPending}
                          className="p-2 rounded-lg text-foreground-muted hover:text-error hover:bg-error/10 transition-colors"
                          title="Eliminar recordatorio"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center bg-surface-low/50 rounded-xl border border-dashed border-black/10 dark:border-white/10">
                <div className="h-10 w-10 rounded-full bg-surface-card flex items-center justify-center text-foreground-muted/40 mb-3 shadow-sm">
                  <FiBell size={16} />
                </div>
                <p className="text-xs text-foreground-muted font-medium">
                  No hay recordatorios programados
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Reminder Modal */}
      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        title={
          editingReminderId ? "Editar Recordatorio" : "Añadir Recordatorio"
        }
      >
        <form
          onSubmit={handleAddReminder}
          className="space-y-5 sm:space-y-6"
          noValidate
        >
          <SelectField
            label="Tipo de Recordatorio"
            id="reminder-type"
            icon={FiBell}
            value={reminderType}
            onChange={(val) => setReminderType(val as ReminderType)}
            placeholder="Selecciona el medio..."
            options={[
              { value: "EMAIL", label: "Email" },
              { value: "SMS", label: "SMS" },
              { value: "WHATSAPP", label: "WhatsApp" },
            ]}
          />

          <InputField
            label="Fecha y Hora (hasta 1 día antes)"
            id="reminder-date"
            icon={FiCalendar}
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
            required
            min={new Date(
              new Date().getTime() - new Date().getTimezoneOffset() * 60000,
            )
              .toISOString()
              .slice(0, 16)}
            max={new Date(
              new Date(task.dueDate).getTime() -
                24 * 60 * 60 * 1000 -
                new Date().getTimezoneOffset() * 60000,
            )
              .toISOString()
              .slice(0, 16)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={() => setIsReminderModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-low transition-colors"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isPending
                ? "Procesando..."
                : editingReminderId
                  ? "Actualizar Recordatorio"
                  : "Crear Recordatorio"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
