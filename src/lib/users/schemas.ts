import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido"),
  lastname: z.string().trim().optional(),
  email: z.string().trim().min(1, "El email es requerido").email("Email inválido"),
  username: z.string().trim().min(1, "El usuario es requerido").min(3, "Mínimo 3 caracteres"),
  password: z.string().optional().or(z.literal("")),
  rolId: z.coerce.number().min(1, "El rol es requerido"),
});
