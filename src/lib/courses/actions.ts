"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/definitions";

import { CourseSchema } from "./schemas";

// ── Leer cursos por usuario ────────────────────────────
export async function getCoursesByUser(
  userId: number,
  page: number = 1,
  limit: number = 6,
): Promise<ActionResult<any>> {
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




// ── Crear ──────────────────────────────────────────────
/**
 * Crea un nuevo curso asignado a un usuario específico.
 */
export async function createCourse(
  userId: number,
  data: z.infer<typeof CourseSchema>,
): Promise<ActionResult> {
  const validated = CourseSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
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
 */
export async function updateCourse(
  id: number,
  data: Partial<z.infer<typeof CourseSchema>>,
): Promise<ActionResult> {
  const validated = CourseSchema.partial().safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
    };
  }

  try {
    const course = await prisma.course.update({
      where: { id },
      data: validated.data,
    });
    revalidatePath(`/admin/cursos/${course.userId}`);
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

