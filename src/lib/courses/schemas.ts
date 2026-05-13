import { z } from "zod";

export const CourseSchema = z.object({
  name: z.string().min(1, { message: "El nombre del curso es requerido." }),
  teacher: z.string().min(1, { message: "El profesor es requerido." }),
  color: z.string().optional().or(z.literal("")),
});
