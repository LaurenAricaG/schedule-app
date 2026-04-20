"use server";

import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// import { z } from "zod";

// ── Types ──────────────────────────────────────────────
type GetRolesResponse =
  | { success: true; data: Role[] }
  | { success: false; error: string };

type MutationResponse = { success: true } | { success: false; error: string };

// const RoleSchema = z.object({
//   rol: z.string().min(1, { message: "El nombre del rol es requerido." }),
// });

// ── Leer ───────────────────────────────────────────────
export async function getRoles(): Promise<GetRolesResponse> {
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
// export async function createRole(rol: string): Promise<MutationResponse> {
//   const validated = RoleSchema.safeParse({ rol });

//   if (!validated.success) {
//     return {
//       success: false,
//       error:
//         validated.error.flatten().fieldErrors.rol?.[0] ?? "Datos inválidos.",
//     };
//   }

//   try {
//     await prisma.role.create({ data: { rol: validated.data.rol } });
//     revalidatePath("/admin/roles");
//     return { success: true };
//   } catch {
//     return { success: false, error: "No se pudo crear el rol." };
//   }
// }

// ── Editar ─────────────────────────────────────────────
// export async function updateRole(
//   id: number,
//   rol: string,
// ): Promise<MutationResponse> {
//   const validated = RoleSchema.safeParse({ rol });

//   if (!validated.success) {
//     return {
//       success: false,
//       error:
//         validated.error.flatten().fieldErrors.rol?.[0] ?? "Datos inválidos.",
//     };
//   }

//   try {
//     await prisma.role.update({
//       where: { id },
//       data: { rol: validated.data.rol },
//     });
//     revalidatePath("/admin/roles");
//     return { success: true };
//   } catch {
//     return { success: false, error: "No se pudo actualizar el rol." };
//   }
// }

// ── Eliminar (soft delete) ─────────────────────────────
export async function deleteRole(id: number): Promise<MutationResponse> {
  try {
    await prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/admin/roles");
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo eliminar el rol." };
  }
}

// ── Restaurar ──────────────────────────────────────────
export async function restoreRole(id: number): Promise<MutationResponse> {
  try {
    await prisma.role.update({
      where: { id },
      data: { deletedAt: null },
    });
    revalidatePath("/admin/roles");
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo restaurar el rol." };
  }
}
