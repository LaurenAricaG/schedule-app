"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Modal from "@/components/ui/Modal";
import { UserForm } from "./UserForm";

interface UsersActionsProps {
  roles: any[];
}

export function UsersActions({ roles }: UsersActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 ghost-border cursor-pointer"
        >
          <FiPlus size={18} /> Nuevo usuario
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Crear Nuevo Usuario"
        maxWidth="max-w-2xl"
      >
        <UserForm roles={roles} onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
