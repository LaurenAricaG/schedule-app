"use client";

import { useEffect, useState, useCallback } from "react";
import { Role } from "@/types/definitions";
import CardRoles from "./CardRoles";
import { getRoles } from "@/lib/roles";

const RolesList = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = useCallback(async () => {
    const result = await getRoles();
    if (result.success) setRoles(result.data ?? []);
  }, []);

  useEffect(() => {
    loadRoles().finally(() => setLoading(false));
  }, [loadRoles]);

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-foreground-muted">
        Cargando roles…
      </p>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {roles.map((role) => (
        <CardRoles key={role.id} role={role} onSuccess={loadRoles} />
      ))}
    </section>
  );
};

export default RolesList;
