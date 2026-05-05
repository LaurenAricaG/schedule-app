import { prisma } from "@/lib/prisma";
import { Task, TaskStatus } from "@/generated/prisma/client";

export type TaskWithReminders = Task & {
  reminders: {
    id: number;
    type: string;
    remindAt: Date;
    sent: boolean;
  }[];
};

export async function getTasksByCourseId(
  courseId: number, 
  page: number = 1, 
  pageSize: number = 6,
  tab: string = "active"
) {
  try {
    const skip = (page - 1) * pageSize;

    const where: any = { courseId };

    if (tab === "active") {
      where.deletedAt = null;
      where.status = TaskStatus.PENDING;
    } else if (tab === "completed") {
      where.deletedAt = null;
      where.status = TaskStatus.COMPLETED;
    } else if (tab === "archived") {
      where.deletedAt = { not: null };
    }

    const [tasks, totalTasks] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          reminders: true,
        },
        orderBy: [
          { dueDate: "asc" },
        ],
        skip,
        take: pageSize,
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(totalTasks / pageSize);

    return { 
      success: true, 
      data: tasks,
      totalTasks,
      totalPages,
      currentPage: page 
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: "No se pudieron obtener las tareas" };
  }
}

export async function getTaskById(id: number) {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        reminders: true,
      },
    });

    if (!task || task.deletedAt) {
      return { success: false, error: "Tarea no encontrada" };
    }

    return { success: true, data: task };
  } catch (error) {
    console.error("Error fetching task:", error);
    return { success: false, error: "Error al obtener la tarea" };
  }
}
