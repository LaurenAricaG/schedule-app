"use client";

import { useState } from "react";
import { Course, User } from "@/types/definitions";
import { FiPlus, FiCalendar } from "react-icons/fi";
import Pagination from "@/components/ui/Pagination";
import CardCourse from "./CardCourse";
import { useRouter } from "next/navigation";
import UserSchedule from "./UserSchedule";
import Title from "@/components/ui/Title";
import LazyLink from "@/components/ui/LazyLink";
import Modal from "@/components/ui/Modal";
import { CourseForm } from "@/components/admin/Courses/CourseForm";
import { ScheduleForm } from "@/components/admin/Courses/ScheduleForm";

type CoursesByUserResponse = {
  user: Partial<User> | null;
  courses: Course[];
  total: number;
};

export default function UserCoursesDetail({
  userId,
  initialData,
  page = 1,
  isAdmin = false,
  isRouted = false,
  initialView = "courses",
  scheduleHref = "/panel/horario",
  coursesHref = "/panel/cursos",
  initialSchedules = [],
}: {
  userId: number;
  initialData: CoursesByUserResponse;
  page?: number;
  isAdmin?: boolean;
  isRouted?: boolean;
  initialView?: "courses" | "schedule";
  scheduleHref?: string;
  coursesHref?: string;
  initialSchedules?: any[];
}) {
  const [view, setView] = useState<"courses" | "schedule">(initialView);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const totalItems = initialData.total || 0;
  const limit = 6;
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="space-y-8">
      {/* User Header */}
      <div className="flex flex-col lg:flex-row sm:items-start justify-between gap-4">
        <div>
          <Title
            title={`${view === "courses" ? "Cursos" : "Horario"} ${
              isAdmin
                ? `de ${
                    initialData.user
                      ? `${initialData.user.name} ${initialData.user.lastname}`
                      : "Usuario"
                  }`
                : view === "courses"
                  ? "Asignados"
                  : "Asignado"
            }`}
          />
          {isAdmin ? (
            <p className="text-foreground-muted mt-2">
              {initialData.user?.email}
            </p>
          ) : (
            <p className="text-foreground-muted mt-2">
              Gestiona tus actividades.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {isRouted ? (
            <LazyLink
              href={view === "courses" ? scheduleHref : coursesHref}
              className="inline-flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-surface-card px-2.5 md:px-5 py-2.5 text-sm font-semibold text-primary hover:bg-surface-low transition-colors ghost-border cursor-pointer"
            >
              <FiCalendar />
              {view === "courses" ? "Ver Horario" : "Ver Cursos"}
            </LazyLink>
          ) : (
            <button
              onClick={() =>
                setView(view === "courses" ? "schedule" : "courses")
              }
              className="inline-flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-surface-card px-2.5 md:px-5 py-2.5 text-sm font-semibold text-primary hover:bg-surface-low transition-colors ghost-border cursor-pointer"
            >
              <FiCalendar />
              {view === "courses" ? "Ver Horario" : "Ver Cursos"}
            </button>
          )}
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 ghost-border cursor-pointer"
            >
              <FiPlus size={18} />
              {view === "courses" ? "Nuevo curso" : "Añadir horario"}
            </button>
          )}
        </div>
      </div>

      {view === "courses" ? (
        <>
          {initialData.courses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {initialData.courses.map((course) => (
                <CardCourse
                  key={course.id}
                  course={course}
                  onSuccess={() => router.refresh()}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-foreground-muted">
              Este usuario no tiene cursos asignados.
            </p>
          )}

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              totalItems={totalItems}
              itemsPerPage={limit}
              itemName="cursos"
            />
          )}
        </>
      ) : (
        <UserSchedule
          userId={userId}
          userName={initialData.user?.name ?? ""}
          userLastname={initialData.user?.lastname ?? ""}
          initialSchedules={initialSchedules}
          isAdmin={isAdmin}
        />
      )}

      {/* Admin Action Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={view === "courses" ? "Añadir Nuevo Curso" : "Añadir Horario"}
        maxWidth={view === "courses" ? "max-w-md" : "max-w-lg"}
      >
        {view === "courses" ? (
          <CourseForm 
            userId={userId} 
            onClose={() => setIsModalOpen(false)} 
          />
        ) : (
          <ScheduleForm 
            courses={initialData.courses}
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </Modal>
    </div>
  );
}
