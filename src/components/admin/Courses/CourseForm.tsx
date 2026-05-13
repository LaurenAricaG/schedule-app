"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse, updateCourse } from "@/lib/courses/actions";
import { toast } from "sonner";
import { FiBook, FiUser, FiDroplet } from "react-icons/fi";
import { InputField } from "@/components/ui/Form/Fields";

import { CourseSchema } from "@/lib/courses/schemas";

interface CourseFormProps {
  userId: number;
  initialData?: any;
  onClose: () => void;
}

const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#6366f1", // Indigo
  "#14b8a6", // Teal
];

export function CourseForm({ userId, initialData, onClose }: CourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    teacher: initialData?.teacher || "",
    color: initialData?.color || PRESET_COLORS[0],
  });

  const validate = () => {
    const result = CourseSchema.safeParse(formData);
    const newErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          newErrors[field.toString()] = issue.message;
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Por favor revisa los errores en el formulario");
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (initialData) {
        result = await updateCourse(initialData.id, formData);
      } else {
        result = await createCourse(userId, formData);
      }

      if (result.success) {
        toast.success(
          `Curso ${initialData ? "actualizado" : "creado"} con éxito`,
        );
        router.refresh();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="Nombre del Curso"
        id="course-name"
        icon={FiBook}
        value={formData.name}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
          if (errors.name) setErrors({ ...errors, name: "" });
        }}
        error={errors.name}
        placeholder="Ej. Matemáticas Avanzadas"
        autoFocus
      />

      <InputField
        label="Profesor / Instructor"
        id="course-teacher"
        icon={FiUser}
        value={formData.teacher}
        onChange={(e) => {
          setFormData({ ...formData, teacher: e.target.value });
          if (errors.teacher) setErrors({ ...errors, teacher: "" });
        }}
        error={errors.teacher}
        placeholder="Ej. Ing. Carlos Pérez"
      />

      <div className="space-y-3">
        <label className="block text-xs font-medium uppercase tracking-wide text-foreground-muted">
          Color del Curso
        </label>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`h-9 w-9 rounded-full transition-all duration-200 ring-offset-2 dark:ring-offset-surface ${
                formData.color === color
                  ? "ring-2 ring-primary scale-110 shadow-lg"
                  : "hover:scale-105 opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center border-2 border-dashed border-black/10 dark:border-white/10 ${
                !PRESET_COLORS.includes(formData.color)
                  ? "ring-2 ring-primary scale-110"
                  : ""
              }`}
              style={{
                backgroundColor: !PRESET_COLORS.includes(formData.color)
                  ? formData.color
                  : "transparent",
              }}
            >
              <FiDroplet
                size={14}
                className={
                  !PRESET_COLORS.includes(formData.color)
                    ? "text-white"
                    : "text-foreground-muted"
                }
              />
            </div>
          </div>
        </div>
        {errors.color && <p className="text-xs text-error">{errors.color}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-black/5 dark:border-white/5">
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
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 shadow-lg shadow-primary/20"
        >
          {isSubmitting
            ? "Procesando..."
            : initialData
              ? "Actualizar Curso"
              : "Crear Curso"}
        </button>
      </div>
    </form>
  );
}
