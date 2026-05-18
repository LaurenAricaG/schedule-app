"use client";

import { useState, useEffect, useTransition } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiActivity,
  FiArrowRight,
  FiBook,
  FiUser,
  FiMail,
  FiShield,
  FiCalendar,
} from "react-icons/fi";
import LazyLink from "@/components/ui/LazyLink";
import { cn } from "@/utils/cn.utils";
import { getStudentDashboardData } from "@/lib/panel/actions";
import { toast } from "sonner";

interface Student {
  id: number;
  name: string;
  lastname: string | null;
  email: string;
  username: string;
}

interface ApoderadoDashboardProps {
  initialStudents: Student[];
  session: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function isUrgent(dueDate: Date | string): boolean {
  return new Date(dueDate).getTime() - Date.now() < 86400000 * 2;
}

function formatTime(timeStr: string): string {
  return timeStr;
}

export function ApoderadoDashboard({
  initialStudents,
  session,
}: ApoderadoDashboardProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    initialStudents.length > 0 ? initialStudents[0].id : null
  );
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (selectedStudentId === null) return;

    setLoading(true);
    startTransition(async () => {
      try {
        const result = await getStudentDashboardData(selectedStudentId);
        if (result.success && result.data) {
          setStudentData(result.data);
        } else {
          toast.error(result.error || "No se pudieron cargar los datos del estudiante.");
        }
      } catch (error) {
        toast.error("Ocurrió un error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    });
  }, [selectedStudentId]);

  const currentStudent = initialStudents.find((s) => s.id === selectedStudentId);

  // Parent styling theme colors
  const themeColors = {
    bg: "from-pink-500/10 to-purple-500/5 dark:from-pink-500/20 dark:to-purple-500/10",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/20 dark:border-pink-500/30",
    badge: "bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 border-pink-500/20",
    iconBg: "bg-pink-500 text-white shadow-lg shadow-pink-500/20",
  };

  const getInitials = (name: string, lastname: string | null) => {
    const firstName = name.trim().split(" ");
    if (lastname) return `${firstName[0][0]}${lastname[0]}`.toUpperCase();
    if (firstName.length >= 2) return `${firstName[0][0]}${firstName[1][0]}`.toUpperCase();
    return firstName[0][0].toUpperCase();
  };

  // If apoderado has no students linked
  if (initialStudents.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <FiActivity /> Panel del Apoderado
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              ¡Hola, {session?.user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-foreground-muted text-lg">
              Has iniciado sesión con el rol de{" "}
              <span className={cn("font-bold border px-2.5 py-0.5 rounded-lg text-sm uppercase tracking-wide", themeColors.badge)}>
                Apoderado
              </span>
              .
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto w-full">
          <div className={cn("relative overflow-hidden rounded-4xl bg-linear-to-br border p-8 md:p-12 shadow-sm", themeColors.bg, themeColors.border)}>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
              <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-bold shrink-0", themeColors.iconBg)}>
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider", themeColors.badge)}>
                    Apoderado
                  </span>
                  <h2 className="text-3xl font-black text-foreground mt-2 leading-tight">
                    {session?.user?.name} {session?.user?.lastname}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/5 dark:border-white/5 text-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-foreground-muted/60">Email</p>
                    <p className="font-semibold text-foreground break-all">{session?.user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-foreground-muted/60">Nombre de Usuario</p>
                    <p className="font-semibold text-foreground">@{session?.user?.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center p-8 bg-surface-card border border-black/5 dark:border-white/5 rounded-3xl">
            <h3 className="text-lg font-bold text-foreground">Aún no tienes estudiantes vinculados</h3>
            <p className="text-foreground-muted mt-2 text-sm max-w-md mx-auto leading-relaxed">
              Tu cuenta está activa, pero actualmente no tienes ningún estudiante asociado. Por favor, ponte en contacto con el Administrador del colegio para que vincule tu cuenta con la de tu estudiante.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Progress circle configuration
  const CIRCUMFERENCE = 175.9;
  const completionRate = studentData?.stats?.completionRate ?? 0;
  const ringOffset = CIRCUMFERENCE - (CIRCUMFERENCE * completionRate) / 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <FiActivity /> Control de Estudiantes
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            ¡Hola, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-foreground-muted text-lg">
            Aquí puedes supervisar el rendimiento y progreso académico de tus estudiantes.
          </p>
        </div>
      </div>

      {/* Student Selector Switcher */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-foreground-muted/80">
          Seleccionar Estudiante:
        </h3>
        <div className="flex flex-wrap gap-4">
          {initialStudents.map((student) => {
            const isActive = student.id === selectedStudentId;
            return (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all cursor-pointer text-left",
                  isActive
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                    : "bg-surface-card border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 hover:bg-surface-low text-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0",
                    isActive ? "bg-white/20 text-white" : "bg-avatar/10 text-avatar"
                  )}
                >
                  {getInitials(student.name, student.lastname)}
                </div>
                <div>
                  <p className="text-xs font-black leading-tight">
                    {student.name} {student.lastname?.split(" ")[0] || ""}
                  </p>
                  <p className={cn("text-[10px] opacity-75 mt-0.5", isActive ? "text-white/80" : "text-foreground-muted")}>
                    @{student.username}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Student Dashboard View */}
      {loading || !studentData ? (
        /* Sleek Loading Skeleton */
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-card border border-black/5 dark:border-white/5 rounded-4xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 h-96 bg-surface-card border border-black/5 dark:border-white/5 rounded-4xl" />
            <div className="h-96 bg-surface-card border border-black/5 dark:border-white/5 rounded-4xl" />
          </div>
        </div>
      ) : (
        /* Dashboard Content */
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Student Status Intro */}
          <div className="p-6 rounded-3xl bg-surface-card border border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FiUser size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground">
                  Monitoreando a {currentStudent?.name} {currentStudent?.lastname}
                </h3>
                <p className="text-xs text-foreground-muted">
                  Matrícula: {currentStudent?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <LazyLink
                href={`/panel/cursos?studentId=${selectedStudentId}`}
                className="inline-flex items-center gap-2 rounded-xl bg-surface-low border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 hover:bg-surface-card px-4 py-2 text-xs font-bold text-foreground transition-all cursor-pointer"
              >
                Ver Cursos del Estudiante <FiArrowRight size={12} />
              </LazyLink>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Success Rate */}
            <div className="relative group overflow-hidden rounded-4xl bg-linear-to-br from-primary to-primary/70 p-8 text-white shadow-2xl shadow-primary/20">
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                    Rendimiento de Tareas
                  </p>
                  <h2 className="text-5xl font-black leading-none mt-1">
                    {studentData.stats.completionRate}%
                  </h2>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Pending Tasks */}
            <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60 text-right">
                  Tareas Pendientes
                </p>
                <p className="text-5xl font-black text-foreground">
                  {studentData.stats.pendingTasksCount}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <span className="flex h-2 w-2 rounded-full bg-info animate-pulse" />
                <span className="text-[11px] font-bold text-info uppercase tracking-wider">
                  Actividades en desarrollo
                </span>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60 text-right">
                  Tareas Entregadas
                </p>
                <p className="text-5xl font-black text-success">
                  {studentData.stats.completedTasksCount}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <div className="p-1 rounded-md bg-success/10 text-success">
                  <FiCheckCircle size={14} />
                </div>
                <span className="text-[11px] font-bold text-success uppercase tracking-wider">
                  Objetivos logrados
                </span>
              </div>
            </div>

            {/* Active Courses */}
            <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60 text-right">
                  Cursos Registrados
                </p>
                <p className="text-5xl font-black text-foreground">
                  {studentData.stats.activeCourses}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <div className="p-1 rounded-md bg-warning/10 text-warning">
                  <FiBook size={14} />
                </div>
                <span className="text-[11px] font-bold text-warning uppercase tracking-wider">
                  Carga académica
                </span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Side: Recent Activity Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  Actividad Reciente
                </h2>
              </div>

              <div className="relative pl-2">
                <div className="absolute left-[1.2rem] top-3 bottom-3 w-[1.5px] bg-linear-to-b from-primary/30 via-black/5 to-transparent dark:via-white/5" />

                <div className="space-y-8">
                  {studentData.recentActivity.length === 0 ? (
                    <div className="ml-10 p-12 text-center bg-surface-card border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                      <FiActivity size={32} className="mx-auto text-foreground-muted/20 mb-4" />
                      <p className="text-foreground-muted italic font-medium text-sm">
                        Aún no hay tareas registradas para este estudiante.
                      </p>
                    </div>
                  ) : (
                    studentData.recentActivity.map((item: any) => {
                      const done = item.status === "COMPLETED";
                      return (
                        <div key={item.id} className="relative flex gap-5 group">
                          <div
                            className={cn(
                              "z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xs border-2 border-surface shrink-0",
                              done
                                ? "bg-success/10 text-success"
                                : "bg-primary/10 text-primary"
                            )}
                          >
                            {done ? <FiCheckCircle size={18} /> : <FiClock size={18} />}
                          </div>

                          <div className="flex-1 pt-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md",
                                    done ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                                  )}
                                >
                                  {done ? "ENTREGADO" : "PENDIENTE"}
                                </span>
                                <time className="text-[10px] font-bold text-foreground-muted/50 uppercase">
                                  {new Date(item.date).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </time>
                              </div>
                            </div>

                            <div className="bg-surface-card/50 backdrop-blur-xs border border-black/5 dark:border-white/5 rounded-2xl p-4 hover:border-primary/20 hover:bg-surface-card transition-all duration-300">
                              <h3 className="text-sm font-bold text-foreground leading-snug">
                                {item.title}
                              </h3>
                              <div className="mt-2 flex items-center gap-2">
                                <FiBook size={12} className="text-foreground-muted" />
                                <span className="text-xs font-semibold text-foreground-muted">
                                  {item.courseName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Sidebar Focus */}
            <div className="space-y-8">
              {/* Prioritized Tasks */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-warning rounded-full" />
                  Tareas Prioritarias
                </h2>

                <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 shadow-sm overflow-hidden divide-y divide-black/5 dark:divide-white/5">
                  {studentData.pendingTasks.length === 0 ? (
                    <div className="p-10 text-center text-sm text-foreground-muted italic">
                      No hay tareas pendientes.
                    </div>
                  ) : (() => {
                    const now = new Date();
                    const overdue = studentData.pendingTasks.filter(
                      (t: any) => new Date(t.dueDate) < now
                    );
                    const urgent = studentData.pendingTasks.filter((t: any) => {
                      const due = new Date(t.dueDate);
                      return due >= now && due.getTime() - now.getTime() < 86400000 * 2;
                    });
                    const upcoming = studentData.pendingTasks.filter((t: any) => {
                      const due = new Date(t.dueDate);
                      return due.getTime() - now.getTime() >= 86400000 * 2;
                    });

                    return (
                      <>
                        {/* Overdue */}
                        {overdue.map((task: any) => (
                          <div
                            key={task.id}
                            className="p-6 space-y-3 bg-error/5 group hover:bg-error/10 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-error uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-error" /> Vencida
                              </span>
                              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">
                                {task.course.name}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-foreground leading-tight line-clamp-2">
                              {task.title}
                            </h4>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs font-bold text-error">
                                Expiró el{" "}
                                {new Date(task.dueDate).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Urgent */}
                        {urgent.map((task: any) => (
                          <div
                            key={task.id}
                            className="p-6 space-y-3 group hover:bg-surface-low/20 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-warning uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />{" "}
                                Urgente
                              </span>
                              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">
                                {task.course.name}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-foreground leading-tight line-clamp-2">
                              {task.title}
                            </h4>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs font-semibold text-foreground-muted">
                                Vence en menos de 48h
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Upcoming */}
                        {upcoming.map((task: any) => (
                          <div
                            key={task.id}
                            className="p-6 space-y-3 group hover:bg-surface-low/20 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                Próxima
                              </span>
                              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">
                                {task.course.name}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-foreground leading-tight line-clamp-2">
                              {task.title}
                            </h4>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs font-medium text-foreground-muted">
                                Vence el{" "}
                                {new Date(task.dueDate).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Progress Circular ring */}
              <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 p-8 shadow-sm space-y-6 text-center">
                <h3 className="text-xs font-black text-foreground-muted uppercase tracking-widest">
                  Progreso del Semestre
                </h3>

                <div className="relative w-32 h-32 mx-auto">
                  <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                    <circle
                      cx="36"
                      cy="36"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-surface-low"
                    />
                    <circle
                      cx="36"
                      cy="36"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={ringOffset}
                      strokeLinecap="round"
                      className="text-primary transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-foreground">
                      {completionRate}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-foreground">
                    {completionRate === 0
                      ? "¡Momento de empezar!"
                      : completionRate < 40
                      ? "¡Buen comienzo!"
                      : completionRate < 80
                      ? "¡Vas por muy buen camino!"
                      : completionRate < 100
                      ? "¡Casi llega a la meta!"
                      : "¡Objetivo cumplido!"}
                  </p>
                  <p className="text-xs text-foreground-muted leading-relaxed max-w-[180px] mx-auto">
                    {completionRate === 0
                      ? "Tu estudiante aún no ha iniciado tareas."
                      : `Tu estudiante ha superado el ${completionRate}% de sus metas.`}
                  </p>
                </div>
              </div>

              {/* Next Class Session */}
              <div className="p-8 rounded-4xl bg-linear-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/10 space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm uppercase tracking-widest">
                    Próxima Clase
                  </h4>
                  <FiCalendar size={20} />
                </div>

                {studentData.stats.nextClass ? (() => {
                  const DAYS_SPANISH: Record<string, string> = {
                    MONDAY: "Lunes",
                    TUESDAY: "Martes",
                    WEDNESDAY: "Miércoles",
                    THURSDAY: "Jueves",
                    FRIDAY: "Viernes",
                    SATURDAY: "Sábado",
                    SUNDAY: "Domingo",
                  };
                  return (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-2xl font-black leading-tight line-clamp-2">
                          {studentData.stats.nextClass.course.name}
                        </p>
                        <p className="text-xs font-bold opacity-80 uppercase tracking-tighter">
                          {DAYS_SPANISH[studentData.stats.nextClass.dayOfWeek] ||
                            studentData.stats.nextClass.dayOfWeek}{" "}
                          • {studentData.stats.nextClass.startTime}
                        </p>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="space-y-2">
                    <p className="text-lg font-bold">Sin clases programadas</p>
                    <p className="text-xs opacity-70">
                      El estudiante no registra clases próximas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
