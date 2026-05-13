"use server";

import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/generated/prisma";

export async function getAdminStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      newUsersThisMonth,
      totalCourses,
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks,
      totalSchedules,
      recentUsers,
      newUsersToday,
      topCourses,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),

      prisma.user.count({
        where: { createdAt: { gte: startOfMonth }, deletedAt: null },
      }),

      prisma.course.count({ where: { deletedAt: null } }),

      prisma.task.count({ where: { deletedAt: null } }),

      prisma.task.count({
        where: { status: TaskStatus.PENDING, dueDate: { gte: now }, deletedAt: null },
      }),

      prisma.task.count({
        where: { status: TaskStatus.COMPLETED, deletedAt: null },
      }),

      prisma.task.count({
        where: { status: TaskStatus.PENDING, dueDate: { lt: now }, deletedAt: null },
      }),

      prisma.schedule.count({ where: { deletedAt: null } }),

      prisma.user.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { rol: true },
      }),

      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          },
          deletedAt: null
        },
      }),

      // Top cursos por cantidad de tareas
      prisma.course.findMany({
        where: { deletedAt: null },
        take: 5,
        include: {
          _count: { select: { tasks: true } },
        },
        orderBy: {
          tasks: { _count: "desc" },
        },
      }),
    ]);

    // ── Registros por mes (últimos 6 meses) ─────────────────────────────────
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const usersLast6Months = await prisma.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo }, deletedAt: null },
      select: { createdAt: true },
    });

    const monthLabels = [];
    const monthCounts = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("es-ES", { month: "short" });
      const count = usersLast6Months.filter((u) => {
        const ud = new Date(u.createdAt);
        return (
          ud.getFullYear() === d.getFullYear() &&
          ud.getMonth() === d.getMonth()
        );
      }).length;
      monthLabels.push(label);
      monthCounts.push(count);
    }

    // ── Tareas completadas por semana del mes actual ─────────────────────────
    const completedThisMonth = await prisma.task.findMany({
      where: {
        status: TaskStatus.COMPLETED,
        deletedAt: null,
        createdAt: { gte: startOfMonth },
      },
      select: { createdAt: true },
    });

    const weeklyCompleted = [0, 0, 0, 0];
    completedThisMonth.forEach((t) => {
      const day = new Date(t.createdAt).getDate();
      const week = Math.min(Math.floor((day - 1) / 7), 3);
      weeklyCompleted[week]++;
    });

    // ── Actividad reciente ──────────────────────
    const [recentCompletedTasks, recentRegistrations, recentCourses] =
      await Promise.all([
        prisma.task.findMany({
          take: 3,
          where: { status: TaskStatus.COMPLETED, deletedAt: null },
          orderBy: { createdAt: "desc" },
          include: { course: { include: { user: true } } },
        }),
        prisma.user.findMany({
          take: 3,
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, lastname: true, createdAt: true },
        }),
        prisma.course.findMany({
          take: 2,
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, createdAt: true },
        }),
      ]);

    type ActivityItem = {
      type: "task_completed" | "user_registered" | "course_created";
      label: string;
      date: Date;
    };

    const activity: ActivityItem[] = [
      ...recentCompletedTasks.map((t) => ({
        type: "task_completed" as const,
        label: `${t.course.user.name} completó "${t.title}"`,
        date: new Date(t.createdAt),
      })),
      ...recentRegistrations.map((u) => ({
        type: "user_registered" as const,
        label: `${u.name} ${u.lastname} se registró`,
        date: new Date(u.createdAt),
      })),
      ...recentCourses.map((c) => ({
        type: "course_created" as const,
        label: `Nuevo curso creado: "${c.name}"`,
        date: new Date(c.createdAt),
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 6);

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      success: true,
      data: {
        totalUsers,
        newUsersThisMonth,
        newUsersToday,
        totalCourses,
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
        totalSchedules,
        completionRate,
        recentUsers,
        topCourses: topCourses.map((c) => ({
          id: c.id,
          name: c.name,
          taskCount: c._count.tasks,
        })),
        registrosPorMes: { labels: monthLabels, counts: monthCounts },
        weeklyCompleted,
        recentActivity: activity,
      },
    };
  } catch (error) {
    console.error("[getAdminStats]", error);
    return { success: false, error: "No se pudieron cargar los datos." };
  }
}
