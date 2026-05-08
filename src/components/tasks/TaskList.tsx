"use client";

import { useState } from "react";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { FiPlus, FiInbox, FiFilter } from "react-icons/fi";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import { cn } from "@/utils/cn.utils";

interface TaskListProps {
  courseId: number;
  initialTasks: any[];
  totalPages: number;
  currentPage: number;
  totalTasks: number;
  isAdminView?: boolean;
}

import { useRouter, useSearchParams } from "next/navigation";

export function TaskList({ 
  courseId, 
  initialTasks, 
  totalPages, 
  currentPage, 
  totalTasks,
  isAdminView = false
}: TaskListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "active";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
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
                onClick={openCreateModal}
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

      {/* 3. Encabezados de Tabla (Desktop) */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-6 px-6 text-[10px] font-black text-foreground-muted/40 uppercase tracking-[0.2em]">
        <div >Título de la Tarea</div>
        <div className="w-30 text-center">Fecha Entrega</div>
        <div className="w-50 text-center">Estado</div>
        <div className="w-44 text-center">Acciones</div>
      </div>

      {/* 4. Lista de Tareas */}
      <div className="grid gap-4">
        {initialTasks.length > 0 ? (
          initialTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onEdit={openEditModal}
              isAdminView={isAdminView}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-foreground/5 rounded-4xl bg-surface-low/20">
            <div className="h-20 w-20 bg-surface-card border border-black/5 dark:border-white/10 text-foreground-muted rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <FiInbox size={40} />
            </div>
            <h3 className="text-xl font-bold text-foreground">No hay tareas aún</h3>
            <p className="text-sm text-foreground-muted max-w-xs mx-auto mt-2">
              Esta sección está vacía. ¡Comienza creando tu primera actividad para el curso!
            </p>
          </div>
        )}
      </div>

      {/* 5. Paginación */}
      <div className="pt-4">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          totalItems={totalTasks}
          itemsPerPage={6}
          itemName="actividades"
        />
      </div>

      {/* Reusable Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? "Editar Tarea" : "Nueva Tarea"}
        maxWidth="max-w-xl"
      >
        <TaskForm 
          courseId={courseId} 
          initialData={editingTask} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
