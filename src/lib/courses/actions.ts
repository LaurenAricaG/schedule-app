"use server";

import { Course } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { User } from "@/types/definitions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResult } from "@/types/definitions";

type GetCoursesByUserResponse = ActionResult<{
  user: Partial<User> | null;
  courses: Course[];
  total: number;
}>;

const CourseSchema = z.object({
  name: z.string().min(1, { message: "El nombre del curso es requerido." }),
  teacher: z.string().min(1, { message: "El profesor es requerido." }),
  color: z.string().optional(),
});

// ── Usuarios con cantidad de cursos ───────────────────
/**
 * Obtiene la lista de usuarios con rol de estudiante y la cantidad total de cursos asignados a cada uno.
 * @returns {Promise<ActionResult<any>>} Resultado de la operación con la data de usuarios.
 */
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
/**
 * Obtiene la lista de cursos específicos de un usuario.
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<GetCoursesByUserResponse>} Objeto con el usuario y sus cursos.
 */
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
/**
 * Obtiene los horarios agrupados por día de un usuario específico.
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<ActionResult>} Horarios agrupados por día de la semana.
 */
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

// ── Crear ──────────────────────────────────────────────
/**
 * Crea un nuevo curso asignado a un usuario específico.
 * @param {number} userId - El ID del usuario al que se le asignará el curso.
 * @param {z.infer<typeof CourseSchema>} data - Datos validados del curso.
 * @returns {Promise<ActionResult>} Resultado de la creación.
 */
export async function createCourse(
  userId: number,
  data: z.infer<typeof CourseSchema>,
): Promise<ActionResult> {
  const validated = CourseSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error:
        validated.error.flatten().fieldErrors.name?.[0] ?? "Datos inválidos.",
    };
  }

  try {
    await prisma.course.create({
      data: {
        ...validated.data,
        userId,
      },
    });
    revalidatePath(`/admin/cursos/${userId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo crear el curso." };
  }
}

// ── Editar ─────────────────────────────────────────────
/**
 * Actualiza los datos de un curso existente.
 * @param {number} id - ID del curso a editar.
 * @param {Partial<z.infer<typeof CourseSchema>>} data - Datos a actualizar.
 * @returns {Promise<ActionResult>} Resultado de la actualización.
 */
export async function updateCourse(
  id: number,
  data: Partial<z.infer<typeof CourseSchema>>,
): Promise<ActionResult> {
  const validated = CourseSchema.partial().safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: "Datos inválidos.",
    };
  }

  try {
    await prisma.course.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath(`/admin/cursos`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo actualizar el curso." };
  }
}

// ── Eliminar (soft delete) ─────────────────────────────
/**
 * Realiza un borrado lógico (soft delete) de un curso.
 * @param {number} id - ID del curso a eliminar.
 * @returns {Promise<ActionResult>} Resultado de la eliminación.
 */
export async function deleteCourse(id: number): Promise<ActionResult> {
  try {
    await prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath(`/admin/cursos`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar el curso." };
  }
}

// ── Restaurar ──────────────────────────────────────────
/**
 * Restaura un curso que fue eliminado lógicamente.
 * @param {number} id - ID del curso a restaurar.
 * @returns {Promise<ActionResult>} Resultado de la restauración.
 */
export async function restoreCourse(id: number): Promise<ActionResult> {
  try {
    await prisma.course.update({
      where: { id },
      data: { deletedAt: null },
    });
    revalidatePath(`/admin/cursos`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo restaurar el curso." };
  }
}
// ── Leer curso por ID ──────────────────────────────────
/**
 * Obtiene los detalles de un curso específico por su ID.
 * @param {number} id - El ID del curso.
 * @returns {Promise<ActionResult<Course>>} Resultado con los datos del curso.
 */
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
