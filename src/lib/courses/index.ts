import { Course } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { User } from "@/types/definitions";
import { ActionResult } from "@/types/definitions";

type GetCoursesByUserResponse = ActionResult<{
  user: Partial<User> | null;
  courses: Course[];
  total: number;
}>;

// ── Usuarios con cantidad de cursos ───────────────────
export async function getUsersWithCoursesCount(
  page: number = 1,
  limit: number = 10,
): Promise<ActionResult<any>> {
  try {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          deletedAt: null,
          rol: {
            rol: "estudiante",
          },
        },
        include: {
          _count: {
            select: { courses: true },
          },
        },
        orderBy: {
          name: "asc",
        },
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: {
          deletedAt: null,
          rol: {
            rol: "estudiante",
          },
        },
      }),
    ]);

    return { success: true, data: { users, total } };
  } catch {
    return {
      success: false,
      error: "No se pudieron cargar los usuarios",
    };
  }
}

// ── Leer cursos por usuario ────────────────────────────
export async function getCoursesByUser(
  userId: number,
  page: number = 1,
  limit: number = 6,
): Promise<GetCoursesByUserResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
      },
    });

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      prisma.course.count({ where: { userId } }),
    ]);

    return {
      success: true,
      data: {
        user,
        courses,
        total,
      },
    };
  } catch {
    return { success: false, error: "No se pudieron cargar los cursos" };
  }
}

// ── Horario por usuario ────────────────────────────────
export async function getScheduleByUser(
  userId: number,
): Promise<ActionResult<any>> {
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        deletedAt: null,
        course: {
          userId,
          deletedAt: null,
        },
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            color: true,
            teacher: true,
          },
        },
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return { success: true, data: schedules };
  } catch {
    return { success: false, error: "No se pudo cargar el horario." };
  }
}

// ── Leer curso por ID ──────────────────────────────────
export async function getCourseById(id: number): Promise<ActionResult<any>> {
  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
      },
    });

    if (!course) {
      return { success: false, error: "Curso no encontrado" };
    }

    return { success: true, data: course };
  } catch {
    return { success: false, error: "Error al obtener el curso" };
  }
}

export * from "./actions";
