"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult, UserWithRolDTO } from "@/types/definitions";
import { revalidatePath } from "next/cache";


// ── Eliminar (soft delete) ─────────────────────────────
/**
 * Realiza un borrado lógico (soft delete) de un usuario.
 * @param {number} id - ID del usuario a eliminar.
 * @returns {Promise<ActionResult>} Resultado de la eliminación.
 */
export async function deleteUser(id: number): Promise<ActionResult> {
  try {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: false },
    });
    revalidatePath("/admin/users");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo eliminar el usuario." };
  }
}

// ── Restaurar ──────────────────────────────────────────
/**
 * Restaura un usuario que fue eliminado lógicamente.
 * @param {number} id - ID del usuario a restaurar.
 * @returns {Promise<ActionResult>} Resultado de la restauración.
 */
export async function restoreUser(id: number): Promise<ActionResult> {
  try {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: null, status: true },
    });
    revalidatePath("/admin/users");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo restaurar el usuario." };
  }
}
