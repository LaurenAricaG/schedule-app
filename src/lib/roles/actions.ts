"use server";

import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResult } from "@/types/definitions";

const RoleSchema = z.object({
  rol: z.string().min(1, { message: "El nombre del rol es requerido." }),
});

// ── Leer ───────────────────────────────────────────────
/**
 * Obtiene la lista de todos los roles ordenados por fecha de creación.
 * @returns {Promise<ActionResult<Role[]>>} Lista de roles.
 */
export async function getRoles(): Promise<ActionResult<Role[]>> {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: roles };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { success: false, error: "No se pudieron cargar los roles" };
  }
}

// ── Crear ──────────────────────────────────────────────
/**
 * Crea un nuevo rol.
 * @param {string} rol - Nombre del rol a crear.
 * @returns {Promise<ActionResult>} Resultado de la creación.
 */
export async function createRole(rol: string): Promise<ActionResult> {
  const validated = RoleSchema.safeParse({ rol });

  if (!validated.success) {
    return {
      success: false,
      error:
        validated.error.flatten().fieldErrors.rol?.[0] ?? "Datos inválidos.",
    };
  }

  try {
    await prisma.role.create({ data: { rol: validated.data.rol } });
    revalidatePath("/admin/roles");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo crear el rol." };
  }
}

// ── Editar ─────────────────────────────────────────────
/**
 * Actualiza el nombre de un rol existente.
 * @param {number} id - ID del rol a editar.
 * @param {string} rol - Nuevo nombre del rol.
 * @returns {Promise<ActionResult>} Resultado de la actualización.
 */
export async function updateRole(
  id: number,
  rol: string,
): Promise<ActionResult> {
  const validated = RoleSchema.safeParse({ rol });

  if (!validated.success) {
    return {
      success: false,
      error:
        validated.error.flatten().fieldErrors.rol?.[0] ?? "Datos inválidos.",
    };
  }

  try {
    await prisma.role.update({
      where: { id },
      data: { rol: validated.data.rol },
    });
    revalidatePath("/admin/roles");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo actualizar el rol." };
  }
}

// ── Eliminar (soft delete) ─────────────────────────────
/**
 * Realiza un borrado lógico (soft delete) de un rol.
 * @param {number} id - ID del rol a eliminar.
 * @returns {Promise<ActionResult>} Resultado de la eliminación.
 */
export async function deleteRole(id: number): Promise<ActionResult> {
  try {
    await prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/admin/roles");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar el rol." };
  }
}

// ── Restaurar ──────────────────────────────────────────
/**
 * Restaura un rol que fue eliminado lógicamente.
 * @param {number} id - ID del rol a restaurar.
 * @returns {Promise<ActionResult>} Resultado de la restauración.
 */
export async function restoreRole(id: number): Promise<ActionResult> {
  try {
    await prisma.role.update({
      where: { id },
      data: { deletedAt: null },
    });
    revalidatePath("/admin/roles");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo restaurar el rol." };
  }
}
