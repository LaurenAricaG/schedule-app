import { z } from "zod";
import { DayOfWeek } from "@/generated/prisma/client";

export const ScheduleSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek, {
    message: "El día de la semana es requerido",
  }),
  startTime: z.string().min(1, "La hora de inicio es requerida"),
  endTime: z.string().min(1, "La hora de fin es requerida"),
  courseId: z.coerce.number().min(1, "El curso es requerido"),
});
