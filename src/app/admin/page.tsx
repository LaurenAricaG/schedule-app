import { BiCheckCircle, BiTimeFive } from "react-icons/bi";

const stats = [
  { label: "Usuarios", value: "1,284", badge: "+12%", tone: "success" },
  { label: "Cursos", value: "47", badge: "+3", tone: "warning" },
  { label: "Activos hoy", value: "328", badge: "+5%", tone: "success" },
  { label: "Completados", value: "89%", badge: "meta", tone: "success" },
] as const;

const progressCourses = [
  { name: "Diseno UI", value: 87, colorClass: "bg-(--color-course-1)" },
  { name: "Frontend", value: 72, colorClass: "bg-(--color-course-2)" },
  { name: "Backend", value: 60, colorClass: "bg-(--color-course-3)" },
  { name: "DevOps", value: 45, colorClass: "bg-(--color-course-4)" },
  { name: "Seguridad", value: 33, colorClass: "bg-(--color-course-5)" },
] as const;

const activity = [
  {
    name: "Ana Carrillo",
    action: "completo Diseno UI",
    time: "hace 5 min",
  },
  {
    name: "Luis Mendez",
    action: "actualizo el curso de Backend",
    time: "hace 18 min",
  },
  {
    name: "Paola Ruiz",
    action: "asigno el rol de docente",
    time: "hace 42 min",
  },
] as const;

function badgeToneClass(tone: "success" | "warning") {
  if (tone === "warning") {
    return "bg-(--color-warning)/14 text-(--color-warning)";
  }
  return "bg-(--color-success)/14 text-(--color-success)";
}

function initials(name: string) {
  const [first = "", second = ""] = name.split(" ");
  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase();
}

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-black/10 bg-(--color-surface-card) p-6 dark:border-white/10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-(--color-foreground-muted)">
          Administracion
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-(--color-foreground)">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-(--color-foreground-muted)">
          Bienvenido al panel de administracion. Gestiona usuarios, cursos y
          roles desde una vista limpia en light y dark.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-4 rounded-2xl bg-surface-low/55 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-black/10 bg-(--color-surface-card) p-5 dark:border-white/10"
              >
                <p className="text-sm text-(--color-foreground-muted)">
                  {item.label}
                </p>
                <p className="mt-1 text-4xl font-semibold tracking-tight text-(--color-foreground)">
                  {item.value}
                </p>
                <span
                  className={`mt-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeToneClass(item.tone)}`}
                >
                  {item.badge}
                </span>
              </article>
            ))}
          </div>

          <article className="rounded-xl border border-black/10 bg-(--color-surface-card) p-5 dark:border-white/10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-(--color-foreground-muted)">
              Cursos por progreso
            </h2>

            <div className="mt-4 space-y-3">
              {progressCourses.map((course) => (
                <div
                  key={course.name}
                  className="grid grid-cols-[1fr_auto] items-center gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-3 w-3 rounded-full ${course.colorClass}`}
                    />
                    <p className="text-sm text-(--color-foreground)">
                      {course.name}
                    </p>
                    <div className="h-1.5 flex-1 rounded-full bg-(--color-surface-low)">
                      <div
                        className={`h-full rounded-full ${course.colorClass}`}
                        style={{ width: `${course.value}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-(--color-foreground-muted)">
                    {course.value}%
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-2xl bg-surface-low/55 p-4">
          <div className="rounded-xl border border-black/10 bg-(--color-surface-card) p-5 dark:border-white/10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-(--color-foreground-muted)">
              Actividad reciente
            </h2>

            <div className="mt-4 space-y-4">
              {activity.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-3 rounded-xl border border-black/10 bg-(--color-surface-card) p-3 dark:border-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg--course-6/20 text-sm font-semibold text-(--color-course-6)">
                    {initials(item.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-(--color-foreground)">
                      {item.name}
                    </p>
                    <p className="text-sm text-(--color-foreground-muted)">
                      {item.action}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-(--color-foreground-muted)">
                      <BiTimeFive />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-primary/25 bg-primary/10 p-3 text-sm text-(--color-foreground)">
              <p className="flex items-center gap-2 font-medium text-(--color-primary)">
                <BiCheckCircle />
                Todo en orden
              </p>
              <p className="mt-1 text-(--color-foreground-muted)">
                No hay alertas criticas en el sistema.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
