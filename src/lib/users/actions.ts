"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types/definitions";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { UserSchema } from "./schemas";

// ── Crear ──────────────────────────────────────────────
/**
 * Crea un nuevo usuario en la base de datos.
 */
export async function createUser(data: any): Promise<ActionResult> {
  const validated = UserSchema.safeParse(data);

  if (!validated.success) {
    const firstError = validated.error.issues[0].message;
    return { success: false, error: firstError };
  }

  try {
    if (!data.password) {
      return { success: false, error: "La contraseña es requerida para nuevos usuarios" };
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        ...validated.data,
        password: hashedPassword,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return { success: false, error: "El email o nombre de usuario ya existe." };
    }
    return { success: false, error: "No se pudo crear el usuario." };
  }
}

// ── Actualizar ─────────────────────────────────────────
/**
 * Actualiza los datos de un usuario existente.
 */
export async function updateUser(id: number, data: any): Promise<ActionResult> {
  const validated = UserSchema.partial().safeParse(data);

  if (!validated.success) {
    const firstError = validated.error.issues[0].message;
    return { success: false, error: firstError };
  }

  try {
    const updateData = { ...validated.data };

    // Si hay una nueva contraseña, hashearla
    if (data.password && data.password.trim() !== "") {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/users");
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.code === "P2002") {
      return { success: false, error: "El email o nombre de usuario ya existe." };
    }
    return { success: false, error: "No se pudo actualizar el usuario." };
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
