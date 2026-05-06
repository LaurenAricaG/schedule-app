import { prisma } from "@/lib/prisma";
import { ActionResult, UserDTO } from "@/types/definitions";
import { revalidatePath } from "next/cache";

// ── Leer ───────────────────────────────────────────────
/**
 * Obtiene la lista de todos los usuarios ordenados por fecha de creación.
 * @returns {Promise<ActionResult<User[]>>} Lista de usuarios.
 */

export async function getUsers(
  page: number = 1,
  limit: number = 10,
): Promise<ActionResult<{ users: UserDTO[]; total: number }>> {
  try {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        omit: { password: true, createdAt: true, deletedAt: true }, // ✅
      }),
      prisma.user.count(),
    ]);

    return { success: true, data: { users, total } };
  } catch {
    return {
      success: false,
      error: "No se pudieron cargar los usuarios",
    };
  }
}
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
      data: { deletedAt: new Date() },
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
      data: { deletedAt: null },
    });
    revalidatePath("/admin/users");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "No se pudo restaurar el usuario." };
  }
}
