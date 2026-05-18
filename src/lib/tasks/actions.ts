"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TaskStatus, ReminderType } from "@/generated/prisma/client";

export async function createTask(data: {
  title: string;
  description?: string;
  dueDate: Date;
  courseId: number;
  reminders?: { type: ReminderType; remindAt: Date }[];
}) {
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        courseId: data.courseId,
        status: TaskStatus.PENDING,
        reminders: {
          create: data.reminders?.map((r) => ({
            type: r.type,
            remindAt: r.remindAt,
          })),
        },
      },
    });

    revalidatePath(`/panel/cursos/${data.courseId}`);
    return { success: true, data: task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "No se pudo crear la tarea" };
  }
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    dueDate?: Date;
    status?: TaskStatus;
    reminders?: { type: ReminderType; remindAt: Date }[];
  }
) {
  try {
    // Primero eliminamos los recordatorios existentes si se envían nuevos
    if (data.reminders) {
      await prisma.reminder.deleteMany({
        where: { taskId: id },
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: data.status,
        reminders: data.reminders
          ? {
              create: data.reminders.map((r) => ({
                type: r.type,
                remindAt: r.remindAt,
              })),
            }
          : undefined,
      },
      include: { course: true },
    });

    revalidatePath(`/panel/cursos/${task.courseId}`);
    return { success: true, data: task };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "No se pudo actualizar la tarea" };
  }
}

export async function deleteTask(id: number) {
  try {
    // Eliminar recordatorios en cascada manualmente
    await prisma.reminder.deleteMany({
      where: { taskId: id },
    });

    const task = await prisma.task.delete({
      where: { id },
    });

    revalidatePath(`/panel/cursos/${task.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "No se pudo eliminar la tarea" };
  }
}

export async function toggleTaskStatus(id: number, currentStatus: TaskStatus) {
  try {
    const newStatus =
      currentStatus === TaskStatus.PENDING
        ? TaskStatus.COMPLETED
        : TaskStatus.PENDING;

    const task = await prisma.task.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath(`/panel/cursos/${task.courseId}`);
    return { success: true, data: task };
  } catch (error) {
    console.error("Error toggling task status:", error);
    return { success: false, error: "No se pudo cambiar el estado de la tarea" };
  }
}

export async function addReminder(
  taskId: number,
  data: { type: ReminderType; remindAt: Date }
) {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return { success: false, error: "Tarea no encontrada" };

    const reminder = await prisma.reminder.create({
      data: {
        taskId,
        type: data.type,
        remindAt: data.remindAt,
      },
    });

    revalidatePath(`/panel/cursos/${task.courseId}`);
    return { success: true, data: reminder };
  } catch (error) {
    console.error("Error adding reminder:", error);
    return { success: false, error: "No se pudo agregar el recordatorio" };
  }
}

export async function updateReminder(
  reminderId: number,
  data: { type: ReminderType; remindAt: Date }
) {
  try {
    const reminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: {
        type: data.type,
        remindAt: data.remindAt,
      },
      include: { task: true },
    });

    revalidatePath(`/panel/cursos/${reminder.task.courseId}`);
    return { success: true, data: reminder };
  } catch (error) {
    console.error("Error updating reminder:", error);
    return { success: false, error: "No se pudo actualizar el recordatorio" };
  }
}

export async function deleteReminderAction(reminderId: number) {
  try {
    const reminder = await prisma.reminder.delete({
      where: { id: reminderId },
      include: { task: true },
    });

    revalidatePath(`/panel/cursos/${reminder.task.courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return { success: false, error: "No se pudo eliminar el recordatorio" };
  }
}
