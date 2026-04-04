// prisma/seed.ts
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // roles
  const adminRol = await prisma.role.upsert({
    where: { rol: "admin" },
    update: {},
    create: { rol: "admin" },
  });

  const estudianteRol = await prisma.role.upsert({
    where: { rol: "estudiante" },
    update: {},
    create: { rol: "estudiante" },
  });

  const docenteRol = await prisma.role.upsert({
    where: { rol: "docente" },
    update: {},
    create: { rol: "docente" },
  });

  // usuario admin de prueba
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@schedule.com",
      username: "admin",
      password: passwordHash,
      rolId: adminRol.id,
    },
  });

  console.log("✓ Roles:", adminRol.rol, estudianteRol.rol, docenteRol.rol);
  console.log("✓ Usuario admin — username: admin / password: admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
