import { prisma } from "@/lib/prisma";
import { ActionResult, UserWithRolDTO } from "@/types/definitions";

// ── Leer ───────────────────────────────────────────────
export async function getUsers(
  page: number = 1,
  limit: number = 10,
): Promise<ActionResult<{ users: UserWithRolDTO[]; total: number }>> {
  try {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          lastname: true,
          email: true,
          username: true,
          status: true,
          rolId: true,
          apoderadoId: true,
          rol: {
            select: {
              id: true,
              rol: true,
            },
          },
        },
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

export async function getApoderados() {
  try {
    const apoderados = await prisma.user.findMany({
      where: {
        rol: {
          rol: "apoderado",
        },
        deletedAt: null,
        status: true,
      },
      select: {
        id: true,
        name: true,
        lastname: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: apoderados };
  } catch (error) {
    return {
      success: false,
      error: "No se pudieron cargar los apoderados",
    };
  }
}

export * from "./actions";
