"use client";

import { useState } from "react";
import { Course, User } from "@/types/definitions";
import { FiPlus, FiCalendar } from "react-icons/fi";
import Pagination from "@/components/ui/Pagination";
import CardCourse from "./CardCourse";
import { useRouter } from "next/navigation";
import UserSchedule from "./UserSchedule";
import Title from "@/components/ui/Title";

type CoursesByUserResponse = {
  user: Partial<User> | null;
  courses: Course[];
  total: number;
};

export default function UserCoursesDetail({
  userId,
  initialData,
  page = 1,
}: {
  userId: number;
  initialData: CoursesByUserResponse;
  page?: number;
}) {
  const [view, setView] = useState<"courses" | "schedule">("courses");
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
            title={`${view === "courses" ? "Cursos" : "Horario"} de ${initialData.user ? `${initialData.user.name} ${initialData.user.lastname}` : "Usuario"} `}
          />
          <p className="text-foreground-muted mt-2">
            {initialData.user?.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setView(view === "courses" ? "schedule" : "courses")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors ghost-border cursor-pointer"
          >
            <FiCalendar />
            {view === "courses" ? "Ver Horario" : "Ver Cursos"}
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-surface-card px-5 py-2.5 text-sm font-semibold text-primary hover:bg-surface-low transition-colors ghost-border cursor-pointer">
            <FiPlus />
            {view === "courses" ? "Nuevo curso" : "Añadir horario"}
          </button>
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
        <UserSchedule userId={userId} />
      )}
    </div>
  );
}
