"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { TaskStatus, DayOfWeek } from "@/generated/prisma";

const DAYS_MAP: Record<number, DayOfWeek> = {
  0: DayOfWeek.SUNDAY,
  1: DayOfWeek.MONDAY,
  2: DayOfWeek.TUESDAY,
  3: DayOfWeek.WEDNESDAY,
  4: DayOfWeek.THURSDAY,
  5: DayOfWeek.FRIDAY,
  6: DayOfWeek.SATURDAY,
};

// Helper para formatear el tiempo exacto ignorando zonas horarias (para db.Time)
function formatTime(date: Date): string {
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export async function getUserDashboardData() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  const userId = parseInt(session.user.id);
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayEnum = DAYS_MAP[now.getDay()];

  try {
    const [
      coursesCount,
      pendingTasks,
      completedTasksCount,
      tasksCompletedThisWeek,
      tasksDueToday,
      schedulesToday,
      allSchedules,
      recentActivity
    ] = await Promise.all([
      prisma.course.count({ where: { userId, deletedAt: null } }),
      
      prisma.task.findMany({
        where: { course: { userId }, status: TaskStatus.PENDING, deletedAt: null },
        include: { course: true },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),

      prisma.task.count({
        where: { course: { userId }, status: TaskStatus.COMPLETED, deletedAt: null },
      }),

      prisma.task.count({
        where: {
          course: { userId },
          status: TaskStatus.COMPLETED,
          deletedAt: null,
          createdAt: { gte: sevenDaysAgo }
        },
      }),

      prisma.task.count({
        where: {
          course: { userId },
          status: TaskStatus.PENDING,
          deletedAt: null,
          dueDate: {
            lte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
          }
        },
      }),

      prisma.schedule.count({
        where: { course: { userId }, dayOfWeek: todayEnum, deletedAt: null }
      }),

      prisma.schedule.findMany({
        where: { course: { userId }, deletedAt: null },
        include: { course: true },
      }),

      prisma.task.findMany({
        where: { course: { userId }, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { course: true },
      }),
    ]);

    // Lógica corregida para encontrar la PRÓXIMA clase usando comparaciones de Date
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    let nextClassRaw = allSchedules
      .filter(s => {
        const start = new Date(s.startTime);
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        return s.dayOfWeek === todayEnum && startMinutes > currentMinutes;
      })
      .sort((a, b) => {
        const startA = new Date(a.startTime).getTime();
        const startB = new Date(b.startTime).getTime();
        return startA - startB;
      })[0];

    if (!nextClassRaw) {
      for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (now.getDay() + i) % 7;
        const nextDayEnum = DAYS_MAP[nextDayIndex];
        const classesNextDay = allSchedules
          .filter(s => s.dayOfWeek === nextDayEnum)
          .sort((a, b) => {
            const startA = new Date(a.startTime).getTime();
            const startB = new Date(b.startTime).getTime();
            return startA - startB;
          });
        
        if (classesNextDay.length > 0) {
          nextClassRaw = classesNextDay[0];
          break;
        }
      }
    }

    const totalTasks = pendingTasks.length + completedTasksCount;
    const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

    return {
      success: true,
      data: {
        stats: {
          activeCourses: coursesCount,
          pendingTasksCount: pendingTasks.length,
          completedTasksCount,
          completionRate,
          tasksCompletedThisWeek,
          todayIntensity: tasksDueToday + schedulesToday,
          nextDeadline: pendingTasks.length > 0 ? pendingTasks[0] : null,
          nextClass: nextClassRaw ? {
            ...nextClassRaw,
            startTime: formatTime(new Date(nextClassRaw.startTime)),
          } : null,
        },
        pendingTasks,
        recentActivity: recentActivity.map(task => ({
          id: task.id,
          title: task.title,
          courseName: task.course.name,
          date: task.createdAt,
          status: task.status,
        })),
      },
    };
  } catch (error) {
    console.error("[getUserDashboardData]", error);
    return { success: false, error: "Error al cargar los datos del panel" };
  }
}

export async function getApoderadoStudents() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  const apoderadoId = parseInt(session.user.id);

  try {
    const students = await prisma.user.findMany({
      where: {
        apoderadoId: apoderadoId,
        deletedAt: null,
        status: true,
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        username: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data: students };
  } catch (error) {
    console.error("[getApoderadoStudents]", error);
    return { success: false, error: "Error al cargar los estudiantes" };
  }
}

export async function getStudentDashboardData(studentId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autorizado" };
  }

  const apoderadoId = parseInt(session.user.id);

  try {
    // Validar que el estudiante esté realmente vinculado a este apoderado
    const student = await prisma.user.findFirst({
      where: {
        id: studentId,
        apoderadoId: apoderadoId,
        deletedAt: null,
        status: true,
      },
    });

    if (!student) {
      return { success: false, error: "No tienes permiso para ver este estudiante" };
    }

    const userId = studentId;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayEnum = DAYS_MAP[now.getDay()];

    const [
      coursesCount,
      pendingTasks,
      completedTasksCount,
      tasksCompletedThisWeek,
      tasksDueToday,
      schedulesToday,
      allSchedules,
      recentActivity
    ] = await Promise.all([
      prisma.course.count({ where: { userId, deletedAt: null } }),
      
      prisma.task.findMany({
        where: { course: { userId }, status: TaskStatus.PENDING, deletedAt: null },
        include: { course: true },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),

      prisma.task.count({
        where: { course: { userId }, status: TaskStatus.COMPLETED, deletedAt: null },
      }),

      prisma.task.count({
        where: {
          course: { userId },
          status: TaskStatus.COMPLETED,
          deletedAt: null,
          createdAt: { gte: sevenDaysAgo }
        },
      }),

      prisma.task.count({
        where: {
          course: { userId },
          status: TaskStatus.PENDING,
          deletedAt: null,
          dueDate: {
            lte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
          }
        },
      }),

      prisma.schedule.count({
        where: { course: { userId }, dayOfWeek: todayEnum, deletedAt: null }
      }),

      prisma.schedule.findMany({
        where: { course: { userId }, deletedAt: null },
        include: { course: true },
      }),

      prisma.task.findMany({
        where: { course: { userId }, deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { course: true },
      }),
    ]);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    let nextClassRaw = allSchedules
      .filter(s => {
        const start = new Date(s.startTime);
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        return s.dayOfWeek === todayEnum && startMinutes > currentMinutes;
      })
      .sort((a, b) => {
        const startA = new Date(a.startTime).getTime();
        const startB = new Date(b.startTime).getTime();
        return startA - startB;
      })[0];

    if (!nextClassRaw) {
      for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (now.getDay() + i) % 7;
        const nextDayEnum = DAYS_MAP[nextDayIndex];
        const classesNextDay = allSchedules
          .filter(s => s.dayOfWeek === nextDayEnum)
          .sort((a, b) => {
            const startA = new Date(a.startTime).getTime();
            const startB = new Date(b.startTime).getTime();
            return startA - startB;
          });
        
        if (classesNextDay.length > 0) {
          nextClassRaw = classesNextDay[0];
          break;
        }
      }
    }

    const totalTasks = pendingTasks.length + completedTasksCount;
    const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

    return {
      success: true,
      data: {
        stats: {
          activeCourses: coursesCount,
          pendingTasksCount: pendingTasks.length,
          completedTasksCount,
          completionRate,
          tasksCompletedThisWeek,
          todayIntensity: tasksDueToday + schedulesToday,
          nextDeadline: pendingTasks.length > 0 ? pendingTasks[0] : null,
          nextClass: nextClassRaw ? {
            ...nextClassRaw,
            startTime: formatTime(new Date(nextClassRaw.startTime)),
          } : null,
        },
        pendingTasks,
        recentActivity: recentActivity.map(task => ({
          id: task.id,
          title: task.title,
          courseName: task.course.name,
          date: task.createdAt,
          status: task.status,
        })),
      },
    };
  } catch (error) {
    console.error("[getStudentDashboardData]", error);
    return { success: false, error: "Error al cargar los datos del estudiante" };
  }
}
