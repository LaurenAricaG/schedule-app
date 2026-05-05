"use client";

import { useState } from "react";
import { createTask, updateTask } from "@/lib/tasks/actions";
import { toast } from "sonner";
import { FiCalendar } from "react-icons/fi";
import { InputField, TextAreaField } from "@/components/ui/Form/Fields";

interface TaskFormProps {
  courseId: number;
  initialData?: any;
  onClose: () => void;
}

export function TaskForm({ courseId, initialData, onClose }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    dueDate: initialData?.dueDate 
      ? new Date(initialData.dueDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate + "T12:00:00"),
        courseId,
      };

      let result;
      if (initialData) {
        result = await updateTask(initialData.id, data);
      } else {
        result = await createTask(data);
      }

      if (result.success) {
        toast.success(`Tarea ${initialData ? "actualizada" : "creada"} con éxito`);
        onClose();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <InputField
        label="Título de la tarea"
        id="task-title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="¿Qué tarea tienes pendiente?"
        autoFocus
      />

      <TextAreaField
        label="Descripción"
        id="task-description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Añade detalles adicionales o contexto..."
      />

      <InputField
        label="Fecha de Entrega"
        icon={FiCalendar}
        id="task-date"
        type="date"
        value={formData.dueDate}
        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
      />

      <div className="flex items-center justify-end gap-3 pt-4 sm:pt-6">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-low transition-colors"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Procesando..." : initialData ? "Actualizar Tarea" : "Crear Tarea"}
        </button>
      </div>
    </form>
  );
}
