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
export async function getUsersWithCoursesCount(): Promise<ActionResult<any>> {
  try {
    const users = await prisma.user.findMany({
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
    });
    return { success: true, data: users };
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

    const courses = await prisma.course.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      data: {
        user,
        courses,
      },
    };
  } catch {
    return { success: false, error: "No se pudieron cargar los cursos" };
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
