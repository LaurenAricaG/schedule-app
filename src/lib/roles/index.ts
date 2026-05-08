import { Role } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types/definitions";

// ── Leer ───────────────────────────────────────────────
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

export * from "./actions";
