"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/definitions";
import { ScheduleSchema } from "./schemas";

export async function createSchedule(data: z.infer<typeof ScheduleSchema>): Promise<ActionResult> {
  const validated = ScheduleSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    // Convertir strings "HH:mm" a Date objects para @db.Time
    // Prisma/Postgres Time solo necesita la parte de la hora, pero JS Date necesita todo.
    // Usamos una fecha base cualquiera.
    const start = new Date(`1970-01-01T${data.startTime}:00Z`);
    const end = new Date(`1970-01-01T${data.endTime}:00Z`);

    if (end <= start) {
      return { success: false, error: "La hora de fin debe ser posterior a la de inicio" };
    }

    const schedule = await prisma.schedule.create({
      data: {
        dayOfWeek: data.dayOfWeek,
        startTime: start,
        endTime: end,
        courseId: data.courseId,
      },
      include: { course: true }
    });

    revalidatePath(`/admin/cursos/${schedule.course.userId}/horario`);
    revalidatePath(`/panel/horario`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error creating schedule:", error);
    return { success: false, error: "No se pudo crear el horario" };
  }
}

export async function updateSchedule(id: number, data: z.infer<typeof ScheduleSchema>): Promise<ActionResult> {
  const validated = ScheduleSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    const start = new Date(`1970-01-01T${data.startTime}:00Z`);
    const end = new Date(`1970-01-01T${data.endTime}:00Z`);

    if (end <= start) {
      return { success: false, error: "La hora de fin debe ser posterior a la de inicio" };
    }

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        dayOfWeek: data.dayOfWeek,
        startTime: start,
        endTime: end,
        courseId: data.courseId,
      },
      include: { course: true }
    });

    revalidatePath(`/admin/cursos/${schedule.course.userId}/horario`);
    revalidatePath(`/panel/horario`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: "No se pudo actualizar el horario" };
  }
}

export async function deleteSchedule(id: number): Promise<ActionResult> {
  try {
    const schedule = await prisma.schedule.delete({
      where: { id },
      include: { course: true }
    });
    revalidatePath(`/admin/cursos/${schedule.course.userId}/horario`);
    revalidatePath(`/panel/horario`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return { success: false, error: "No se pudo eliminar el horario" };
  }
}

