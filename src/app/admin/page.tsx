import { getAdminStats } from "@/lib/dashboard/actions";
import {
  FiUsers,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiArrowRight,
  FiUserPlus,
  FiAlertTriangle,
  FiTrendingUp,
  FiActivity,
  FiTarget,
  FiAward,
} from "react-icons/fi";
import Link from "next/link";
import { cn } from "@/utils/cn.utils";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
const AdminPage = async () => {
  const result = await getAdminStats();

  if (!result.success || !result.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold text-error mb-2">Error de Carga</h1>
        <p className="text-foreground-muted">
          {result.error ?? "No se pudieron cargar los datos del dashboard."}
        </p>
      </div>
    );
  }

  const {
    totalUsers,
    newUsersThisMonth,
    newUsersToday,
    totalCourses,
    totalTasks,
    pendingTasks,
    completedTasks,
    overdueTasks,
    totalSchedules,
    completionRate,
    recentUsers,
    topCourses,
    registrosPorMes,
    weeklyCompleted,
    recentActivity,
  } = result.data;

  // ── Stat cards ─────────────────────────────────────────────────────────────
  const stats = [
    {
      label: "Usuarios totales",
      value: totalUsers,
      sub: `+${newUsersThisMonth} este mes`,
      subType: "up",
      icon: FiUsers,
      color: "bg-primary",
      link: "/admin/usuarios",
    },
    {
      label: "Cursos activos",
      value: totalCourses,
      sub: `${totalCourses} publicados`,
      subType: "neutral",
      icon: FiBookOpen,
      color: "bg-info",
      link: "/admin/cursos",
    },
    {
      label: "Tareas pendientes",
      value: pendingTasks,
      sub: overdueTasks > 0 ? `${overdueTasks} vencidas` : "al día",
      subType: overdueTasks > 0 ? "down" : "up",
      icon: FiClock,
      color: "bg-warning",
      link: "/admin/cursos",
    },
    {
      label: "Tasa completado",
      value: `${completionRate}%`,
      sub: completionRate >= 70 ? "buena tendencia" : "necesita atención",
      subType: completionRate >= 70 ? "up" : "down",
      icon: FiTarget,
      color: "bg-success",
      link: "/admin/cursos",
    },
  ];

  // ── Alertas ────────────────────────────────────────────────────────────────
  const alerts = [
    {
      label: "Tareas vencidas sin completar",
      count: overdueTasks,
      level: overdueTasks > 5 ? "danger" : "warn",
      href: "/admin/cursos",
    },
  ].filter((a) => a.count > 0);

  // ── Actividad: icono por tipo ──────────────────────────────────────────────
  const activityIcon = (type: string) => {
    if (type === "task_completed") return { icon: FiCheckCircle, color: "text-success" };
    if (type === "user_registered") return { icon: FiUserPlus, color: "text-info" };
    return { icon: FiBookOpen, color: "text-foreground-muted" };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Panel de Administración
        </h1>
        <p className="text-foreground-muted">
          Resumen global del sistema y actividad de los usuarios.
        </p>
      </div>

      {/* ── Stats grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl bg-surface-card p-6 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted/60">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
                    stat.subType === "up" && "bg-success/10 text-success",
                    stat.subType === "down" && "bg-error/10 text-error",
                    stat.subType === "neutral" && "bg-foreground/5 text-foreground-muted"
                  )}
                >
                  {stat.subType === "up" && <FiTrendingUp size={10} />}
                  {stat.sub}
                </span>
              </div>
              <div
                className={cn(
                  "p-3 rounded-xl text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6",
                  stat.color
                )}
              >
                <stat.icon size={24} />
              </div>
            </div>

            <Link
              href={stat.link}
              className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
            >
              Gestionar <FiArrowRight />
            </Link>

            <div
              className={cn(
                "absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-150",
                stat.color
              )}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FiActivity className="text-primary" /> Actividad reciente
          </h2>

          <div className="rounded-2xl bg-surface-card border border-black/5 dark:border-white/5 shadow-sm divide-y divide-black/5 dark:divide-white/5 overflow-hidden">
            {recentActivity.length === 0 ? (
              <p className="px-6 py-10 text-center text-foreground-muted italic">
                Sin actividad reciente.
              </p>
            ) : (
              recentActivity.map((item, i) => {
                const { icon: Icon, color } = activityIcon(item.type);
                return (
                  <div key={i} className="flex items-start gap-3 px-6 py-4 hover:bg-surface-low/30 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={15} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">
                        {item.label}
                      </p>
                      <p className="text-xs text-foreground-muted mt-0.5">
                        {timeAgo(item.date)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Alertas y Top Cursos */}
        <div className="space-y-8">
          {/* Alertas */}
          {alerts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FiAlertTriangle className="text-warning" /> Alertas
              </h2>
              <div className="rounded-2xl bg-surface-card border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
                {alerts.map((alert, i) => (
                  <Link
                    key={i}
                    href={alert.href}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-surface-low/30 transition-colors group"
                  >
                    <span className="w-2 h-2 rounded-full bg-error shrink-0" />
                    <span className="flex-1 text-sm text-foreground">{alert.label}</span>
                    <span className="text-sm font-bold text-error">{alert.count}</span>
                    <FiArrowRight size={14} className="text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Top Cursos */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FiAward className="text-warning" /> Top Cursos por Tareas
            </h2>
            <div className="rounded-2xl bg-surface-card border border-black/5 dark:border-white/5 shadow-sm divide-y divide-black/5 dark:divide-white/5 overflow-hidden">
              {topCourses.map((course, i) => (
                <div key={course.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-low/30 transition-colors">
                  <span className="text-xs font-bold text-foreground-muted/50 w-4 text-center">{i + 1}</span>
                  <span className="flex-1 text-sm text-foreground truncate font-medium">{course.name}</span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {course.taskCount} tareas
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Usuarios Recientes Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FiUserPlus className="text-primary" /> Usuarios Recientes
          </h2>
          <Link href="/admin/usuarios" className="text-sm font-medium text-primary hover:underline">Ver todos</Link>
        </div>
        <div className="rounded-2xl bg-surface-card border border-black/5 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 bg-surface-low/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground-muted/60">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground-muted/60">Rol</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground-muted/60">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-low/20 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {user.name} {user.lastname}
                        </span>
                        <span className="text-xs text-foreground-muted">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        user.rol.rol === "ADMIN" ? "bg-error/10 text-error" : "bg-info/10 text-info"
                      )}>
                        {user.rol.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">
                      {new Date(user.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
