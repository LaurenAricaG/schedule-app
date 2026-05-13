"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSchedule, updateSchedule } from "@/lib/schedules/actions";
import { ScheduleSchema } from "@/lib/schedules/schemas";
import { toast } from "sonner";
import { FiClock, FiCalendar, FiBook } from "react-icons/fi";
import { InputField, SelectField } from "@/components/ui/Form/Fields";
import { DayOfWeek } from "@/generated/prisma/client";

const DAYS_OPTIONS = [
  { value: "", label: "Seleccionar día" },
  { value: DayOfWeek.MONDAY, label: "Lunes" },
  { value: DayOfWeek.TUESDAY, label: "Martes" },
  { value: DayOfWeek.WEDNESDAY, label: "Miércoles" },
  { value: DayOfWeek.THURSDAY, label: "Jueves" },
  { value: DayOfWeek.FRIDAY, label: "Viernes" },
  { value: DayOfWeek.SATURDAY, label: "Sábado" },
  { value: DayOfWeek.SUNDAY, label: "Domingo" },
];

interface ScheduleFormProps {
  courses: { id: number; name: string }[];
  initialData?: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ScheduleForm({
  courses,
  initialData,
  onClose,
  onSuccess,
}: ScheduleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatTimeForInput = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    // Extraer HH:mm sin importar la zona horaria para el input type="time"
    const h = String(d.getUTCHours()).padStart(2, "0");
    const m = String(d.getUTCMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const [formData, setFormData] = useState<{
    dayOfWeek: DayOfWeek | "";
    startTime: string;
    endTime: string;
    courseId: string | number;
  }>({
    dayOfWeek: initialData?.dayOfWeek || "",
    startTime: initialData?.startTime
      ? formatTimeForInput(initialData.startTime)
      : "07:30",
    endTime: initialData?.endTime
      ? formatTimeForInput(initialData.endTime)
      : "08:45",
    courseId: initialData?.courseId || "",
  });

  const validate = () => {
    const result = ScheduleSchema.safeParse(formData);
    const newErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) newErrors[field.toString()] = issue.message;
      });
    }

    if (formData.endTime <= formData.startTime) {
      newErrors.endTime = "La hora de fin debe ser posterior";
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
      toast.error("Por favor revisa los errores");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        courseId: Number(formData.courseId),
      };

      const result = initialData?.id
        ? await updateSchedule(initialData.id, dataToSubmit as any)
        : await createSchedule(dataToSubmit as any);

      if (result.success) {
        toast.success(
          initialData
            ? "Horario actualizado con éxito"
            : "Horario añadido con éxito",
        );
        router.refresh();
        onSuccess?.();
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

  const courseOptions = [
    { value: "", label: "Seleccionar curso" },
    ...courses.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SelectField
        label="Curso"
        id="schedule-course"
        icon={FiBook}
        value={formData.courseId}
        onChange={(val) => setFormData({ ...formData, courseId: val })}
        options={courseOptions}
        error={errors.courseId}
      />

      <SelectField
        label="Día de la Semana"
        id="schedule-day"
        icon={FiCalendar}
        value={formData.dayOfWeek}
        onChange={(val) =>
          setFormData({ ...formData, dayOfWeek: val as DayOfWeek })
        }
        options={DAYS_OPTIONS}
        error={errors.dayOfWeek}
      />

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Hora Inicio"
          id="schedule-start"
          type="time"
          icon={FiClock}
          value={formData.startTime}
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })
          }
          error={errors.startTime}
        />

        <InputField
          label="Hora Fin"
          id="schedule-end"
          type="time"
          icon={FiClock}
          value={formData.endTime}
          onChange={(e) =>
            setFormData({ ...formData, endTime: e.target.value })
          }
          error={errors.endTime}
        />
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
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-lg shadow-primary/20"
        >
          {isSubmitting
            ? "Procesando..."
            : initialData
              ? "Actualizar Horario"
              : "Añadir Horario"}
        </button>
      </div>
    </form>
  );
}
