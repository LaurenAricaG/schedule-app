"use client";

import { useState } from "react";
import { createUser, updateUser } from "@/lib/users/actions";
import { toast } from "sonner";
import { FiUser, FiMail, FiLock, FiShield, FiTag } from "react-icons/fi";
import { InputField, SelectField } from "@/components/ui/Form/Fields";

import { UserSchema } from "@/lib/users/schemas";

interface UserFormProps {
  initialData?: any;
  roles: { id: number; rol: string }[];
  apoderados: { id: number; name: string; lastname: string | null }[];
  onClose: () => void;
}

export function UserForm({ initialData, roles, apoderados, onClose }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    lastname: initialData?.lastname || "",
    email: initialData?.email || "",
    username: initialData?.username || "",
    password: "",
    rolId: initialData?.rolId || (roles.length > 0 ? roles[0].id : ""),
    apoderadoId: initialData?.apoderadoId || "",
  });

  const validate = () => {
    const result = UserSchema.safeParse(formData);
    const newErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          newErrors[field.toString()] = issue.message;
        }
      });
    }

    // Validación manual adicional para password en creación
    if (!initialData && (!formData.password || formData.password.length < 6)) {
      newErrors.password = formData.password
        ? "La contraseña debe tener al menos 6 caracteres"
        : "La contraseña es obligatoria";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Por favor revisa los errores en el formulario");
      return;
    }

    setIsSubmitting(true);
    try {
      const estudianteRole = roles.find((r) => r.rol === "estudiante");
      const showApoderadoSelect = Number(formData.rolId) === estudianteRole?.id;

      const data = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        username: formData.username,
        rolId: Number(formData.rolId),
        apoderadoId: showApoderadoSelect && formData.apoderadoId !== "" ? Number(formData.apoderadoId) : null,
        ...(formData.password ? { password: formData.password } : {}),
      };

      let result;
      if (initialData) {
        result = await updateUser(initialData.id, data);
      } else {
        result = await createUser(data);
      }

      if (result.success) {
        toast.success(
          `Usuario ${initialData ? "actualizado" : "creado"} con éxito`,
        );
        onClose();
      } else {
        toast.error(result.error);
        // Si el error es de duplicado, marcarlo en el campo correspondiente
        if (result.error?.includes("email"))
          setErrors((prev) => ({
            ...prev,
            email: "Este email ya está registrado",
          }));
        if (result.error?.includes("usuario"))
          setErrors((prev) => ({
            ...prev,
            username: "Este nombre de usuario ya existe",
          }));
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.rol }));
  const estudianteRole = roles.find((r) => r.rol === "estudiante");
  const showApoderadoSelect = Number(formData.rolId) === estudianteRole?.id;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Nombre"
          id="user-name"
          icon={FiUser}
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: "" });
          }}
          error={errors.name}
          placeholder="Ej. Juan"
          autoFocus
        />

        <InputField
          label="Apellido"
          id="user-lastname"
          icon={FiTag}
          value={formData.lastname}
          onChange={(e) =>
            setFormData({ ...formData, lastname: e.target.value })
          }
          error={errors.lastname}
          placeholder="Ej. Pérez"
        />
      </div>

      <InputField
        label="Correo Electrónico"
        id="user-email"
        type="email"
        icon={FiMail}
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
          if (errors.email) setErrors({ ...errors, email: "" });
        }}
        error={errors.email}
        placeholder="juan.perez@ejemplo.com"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          label="Nombre de Usuario"
          id="user-username"
          icon={FiUser}
          value={formData.username}
          onChange={(e) => {
            setFormData({ ...formData, username: e.target.value });
            if (errors.username) setErrors({ ...errors, username: "" });
          }}
          error={errors.username}
          placeholder="juanp88"
        />

        <SelectField
          label="Rol de Usuario"
          id="user-role"
          icon={FiShield}
          value={formData.rolId}
          onChange={(val) => {
            setFormData({ ...formData, rolId: val });
            if (errors.rolId) setErrors({ ...errors, rolId: "" });
          }}
          error={errors.rolId}
          options={roleOptions}
        />
      </div>

      {showApoderadoSelect && (
        <SelectField
          label="Apoderado del Estudiante"
          id="user-apoderado"
          icon={FiUser}
          value={formData.apoderadoId}
          onChange={(val) => {
            setFormData({ ...formData, apoderadoId: val });
          }}
          options={[
            { value: "", label: "Ninguno (Sin apoderado)" },
            ...apoderados.map((a) => ({
              value: a.id,
              label: `${a.name} ${a.lastname || ""}`.trim(),
            })),
          ]}
        />
      )}

      <InputField
        label={initialData ? "Nueva Contraseña (opcional)" : "Contraseña"}
        id="user-password"
        type="password"
        icon={FiLock}
        value={formData.password}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value });
          if (errors.password) setErrors({ ...errors, password: "" });
        }}
        error={errors.password}
        placeholder={
          initialData ? "Dejar en blanco para no cambiar" : "••••••••"
        }
      />

      <div className="flex items-center justify-end gap-3 pt-4 sm:pt-6 border-t border-black/5 dark:border-white/5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-low transition-colors"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 shadow-lg shadow-primary/20"
        >
          {isSubmitting
            ? "Procesando..."
            : initialData
              ? "Actualizar Usuario"
              : "Crear Usuario"}
        </button>
      </div>
    </form>
  );
}
