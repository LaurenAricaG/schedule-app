"use client";

import { FiPlus } from "react-icons/fi";
import { cn } from "@/utils/cn.utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { TaskForm } from "./TaskForm";

interface TaskHeaderProps {
  courseId: number;
  isAdminView?: boolean;
}

export function TaskHeader({ courseId, isAdminView = false }: TaskHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "active";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-8 mb-8">
      {/* 1. Cabecera Premium */}
      {!isAdminView && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Tareas
            </h1>
            <p className="text-sm text-foreground-muted">
              Gestiona tus actividades
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "active" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 ghost-border cursor-pointer"
              >
                <FiPlus size={18} /> Nueva Tarea
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Sistema de Pestañas (Tabs) */}
      <div className="flex items-center gap-7 border-b border-foreground/5 pb-px">
        {[
          { id: "active", label: "Pendientes" },
          { id: "completed", label: "Completadas" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative",
              activeTab === tab.id 
                ? "text-primary" 
                : "text-foreground-muted hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1" />
            )}
          </button>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Tarea"
        maxWidth="max-w-xl"
      >
        <TaskForm 
          courseId={courseId} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
