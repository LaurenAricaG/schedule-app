"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types/definitions";


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
