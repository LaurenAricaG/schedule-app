import { getUserDashboardData } from "@/lib/panel/actions";
import { auth } from "@/lib/auth";
import {
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiActivity,
  FiArrowRight,
  FiTarget,
  FiCalendar,
  FiBook,
  FiAward,
} from "react-icons/fi";
import LazyLink from "@/components/ui/LazyLink";
import { cn } from "@/utils/cn.utils";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function isUrgent(dueDate: Date | string): boolean {
  return new Date(dueDate).getTime() - Date.now() < 86400000 * 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
const PanelPage = async () => {
  const session = await auth();
  const result = await getUserDashboardData();

  if (!result.success || !result.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mb-4">
          <FiActivity size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Error de Carga</h1>
        <p className="text-foreground-muted mt-2 max-w-xs">
          {result.error ?? "No se pudieron cargar los datos de tu panel."}
        </p>
      </div>
    );
  }

  const { stats, pendingTasks, recentActivity } = result.data;

  // Circunferencia del anillo SVG (r=28 → 2π×28 ≈ 175.9)
  const CIRCUMFERENCE = 175.9;
  const ringOffset = CIRCUMFERENCE - (CIRCUMFERENCE * stats.completionRate) / 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* ── Header: Resumen Ejecutivo ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <FiActivity /> Dashboard Personal
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            ¡Qué bueno verte, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-foreground-muted text-lg">
            Hoy es un gran día para completar tus <span className="text-primary font-bold underline decoration-primary/30 underline-offset-4">{stats.pendingTasksCount} objetivos</span> pendientes.
          </p>
        </div>
      </div>

      {/* ── Grid de Métricas Principales ──────────────────────────────────────── */}
      {/* ── Grid de Métricas Principales ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card: Tasa de Éxito (Principal) */}
        <div className="relative group overflow-hidden rounded-4xl bg-linear-to-br from-primary to-primary/70 p-8 text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform duration-500">
          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FiTrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">Rendimiento Global</p>
              <h2 className="text-5xl font-black leading-none mt-1">{stats.completionRate}%</h2>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        </div>

        {/* Card: Tareas en Curso */}
        <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 p-8 flex flex-col justify-between shadow-sm hover:bg-surface-low/30 transition-colors">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60 text-right">Tareas Activas</p>
            <p className="text-5xl font-black text-foreground">{stats.pendingTasksCount}</p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <span className="flex h-2 w-2 rounded-full bg-info animate-pulse" />
            <span className="text-[11px] font-bold text-info uppercase tracking-wider">Productividad activa</span>
          </div>
        </div>

        {/* Card: Logros */}
        <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 p-8 flex flex-col justify-between shadow-sm hover:bg-surface-low/30 transition-colors">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60 text-right">Completadas</p>
            <p className="text-5xl font-black text-success">{stats.completedTasksCount}</p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <div className="p-1 rounded-md bg-success/10 text-success">
              <FiCheckCircle size={14} />
            </div>
            <span className="text-[11px] font-bold text-success uppercase tracking-wider">Objetivos logrados</span>
          </div>
        </div>

        {/* Card: Cursos */}
        <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 p-8 flex flex-col justify-between shadow-sm hover:bg-surface-low/30 transition-colors">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60 text-right">Mis Cursos</p>
            <p className="text-5xl font-black text-foreground">{stats.activeCourses}</p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <div className="p-1 rounded-md bg-warning/10 text-warning">
              <FiBook size={14} />
            </div>
            <span className="text-[11px] font-bold text-warning uppercase tracking-wider">Ruta de aprendizaje</span>
          </div>
        </div>
      </div>

      {/* ── Cuerpo del Dashboard ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Sección Izquierda: Timeline de Actividad */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              Línea de Tiempo
            </h2>
            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Descargar Reporte</button>
          </div>

          <div className="relative pl-2">
            {/* Línea vertical más sutil */}
            <div className="absolute left-[1.2rem] top-3 bottom-3 w-[1.5px] bg-linear-to-b from-primary/30 via-black/5 to-transparent dark:via-white/5" />
            
            <div className="space-y-8">
              {recentActivity.length === 0 ? (
                <div className="ml-10 p-12 text-center bg-surface-card border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
                  <FiActivity size={32} className="mx-auto text-foreground-muted/20 mb-4" />
                  <p className="text-foreground-muted italic font-medium text-sm">Aún no hay actividad registrada.</p>
                </div>
              ) : (
                recentActivity.map((item, idx) => {
                  const done = item.status === "COMPLETED";
                  return (
                    <div key={item.id} className="relative flex gap-5 group">
                      {/* Icono de estado más compacto y estilizado */}
                      <div className={cn(
                        "z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xs border-2 border-surface shrink-0",
                        done 
                          ? "bg-success/10 text-success group-hover:bg-success group-hover:text-white" 
                          : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      )}>
                        {done ? <FiCheckCircle size={18} /> : <FiClock size={18} />}
                      </div>

                      {/* Contenido más limpio y profesional */}
                      <div className="flex-1 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                           <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md",
                                done ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                              )}>
                                {done ? "LOGRADO" : "PENDIENTE"}
                              </span>
                              <time className="text-[10px] font-bold text-foreground-muted/50 uppercase">
                                {new Date(item.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                              </time>
                           </div>
                        </div>
                        
                        <div className="bg-surface-card/50 backdrop-blur-xs border border-black/5 dark:border-white/5 rounded-2xl p-4 hover:border-primary/20 hover:bg-surface-card transition-all duration-300">
                          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
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

        {/* Sección Derecha: Sidebar de Enfoque */}
        <div className="space-y-8">
          
          {/* Próximos Hitos / Tareas Prioritarias */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <span className="w-1.5 h-6 bg-warning rounded-full" />
              Prioridades
            </h2>

            <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 shadow-sm overflow-hidden divide-y divide-black/5 dark:divide-white/5">
              {pendingTasks.length === 0 ? (
                <div className="p-10 text-center text-sm text-foreground-muted italic">
                  No hay hitos pendientes.
                </div>
              ) : (() => {
                const now = new Date();
                const overdue = pendingTasks.filter(t => new Date(t.dueDate) < now);
                const urgent = pendingTasks.filter(t => {
                  const due = new Date(t.dueDate);
                  return due >= now && due.getTime() - now.getTime() < 86400000 * 2;
                });
                const upcoming = pendingTasks.filter(t => {
                   const due = new Date(t.dueDate);
                   return due.getTime() - now.getTime() >= 86400000 * 2;
                });

                return (
                  <>
                    {/* Vencidas */}
                    {overdue.map((task) => (
                      <div key={task.id} className="p-6 space-y-3 bg-error/5 group hover:bg-error/10 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-error uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-error" /> Vencida
                          </span>
                          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">{task.course.name}</span>
                        </div>
                        <h4 className="text-base font-bold text-foreground leading-tight group-hover:text-error transition-colors line-clamp-2">
                          {task.title}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                           <span className="text-xs font-bold text-error">Expiró el {new Date(task.dueDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</span>
                           <LazyLink href={`/panel/cursos/${task.courseId}`} className="p-1.5 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-all">
                             <FiArrowRight size={14} />
                           </LazyLink>
                        </div>
                      </div>
                    ))}

                    {/* Urgentes */}
                    {urgent.map((task) => (
                      <div key={task.id} className="p-6 space-y-3 group hover:bg-surface-low/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-warning uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" /> Urgente
                          </span>
                          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">{task.course.name}</span>
                        </div>
                        <h4 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {task.title}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                           <span className="text-xs font-semibold text-foreground-muted">Vence en menos de 48h</span>
                           <LazyLink href={`/panel/cursos/${task.courseId}`} className="p-1.5 rounded-lg bg-surface-low text-foreground-muted hover:bg-primary hover:text-white transition-all">
                             <FiArrowRight size={14} />
                           </LazyLink>
                        </div>
                      </div>
                    ))}

                    {/* Próximas */}
                    {upcoming.map((task) => (
                      <div key={task.id} className="p-6 space-y-3 group hover:bg-surface-low/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Próxima</span>
                          <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest">{task.course.name}</span>
                        </div>
                        <h4 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {task.title}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                           <span className="text-xs font-medium text-foreground-muted">Vence el {new Date(task.dueDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}</span>
                           <LazyLink href={`/panel/cursos/${task.courseId}`} className="p-1.5 rounded-lg bg-surface-low text-foreground-muted hover:bg-primary hover:text-white transition-all">
                             <FiArrowRight size={14} />
                           </LazyLink>
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Anillo de Meta Circular */}
          <div className="rounded-4xl bg-surface-card border border-black/5 dark:border-white/5 p-8 shadow-sm space-y-6 text-center">
            <h3 className="text-xs font-black text-foreground-muted uppercase tracking-widest">Progreso del Semestre</h3>
            
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                <circle cx="36" cy="36" r="28" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-low" />
                <circle 
                  cx="36" cy="36" r="28" fill="none" stroke="currentColor" strokeWidth="8" 
                  strokeDasharray={CIRCUMFERENCE} strokeDashoffset={ringOffset} strokeLinecap="round" 
                  className="text-primary transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-foreground">{stats.completionRate}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-foreground">
                {stats.completionRate === 0 ? "¡Es momento de empezar!" : 
                 stats.completionRate < 40 ? "¡Buen comienzo!" : 
                 stats.completionRate < 80 ? "¡Vas por muy buen camino!" : 
                 stats.completionRate < 100 ? "¡Casi llegas a la meta!" : 
                 "¡Objetivo cumplido!"}
              </p>
              <p className="text-xs text-foreground-muted leading-relaxed max-w-[180px] mx-auto">
                {stats.completionRate === 0 
                  ? "Organiza tus tareas y da el primer paso hoy." 
                  : `Has superado el ${stats.completionRate}% de tus metas planeadas.`}
              </p>
            </div>
          </div>

          {/* Next Session Card (Replacement for redundant progress) */}
          <div className="p-8 rounded-4xl bg-linear-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/10 space-y-5">
             <div className="flex items-center justify-between">
                <h4 className="font-black text-sm uppercase tracking-widest">Próxima Sesión</h4>
                <FiClock size={20} />
             </div>
             
             {stats.nextClass ? (() => {
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
                      <p className="text-2xl font-black leading-tight line-clamp-2">{stats.nextClass.course.name}</p>
                      <p className="text-xs font-bold opacity-80 uppercase tracking-tighter">
                        {DAYS_SPANISH[stats.nextClass.dayOfWeek] || stats.nextClass.dayOfWeek} • {stats.nextClass.startTime}
                      </p>
                    </div>
                    <div className="pt-2">
                      <LazyLink 
                        href="/panel/horario" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-all"
                      >
                        Ver Horario Completo <FiArrowRight />
                      </LazyLink>
                    </div>
                 </div>
               );
             })() : (
               <div className="space-y-2">
                 <p className="text-lg font-bold">Sin clases programadas</p>
                 <p className="text-xs opacity-70">Disfruta de tu tiempo libre o adelanta tareas pendientes.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelPage;