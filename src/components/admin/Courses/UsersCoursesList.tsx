import { User } from "@/types/definitions";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { getUsersWithCoursesCount } from "@/lib/courses";

type UserWithCourseCount = User & {
  _count: {
    courses: number;
  };
};

/**
 * Componente que muestra una lista de usuarios y la cantidad de cursos que tienen asignados.
 * Es un Server Component asíncrono que obtiene sus propios datos.
 */
export default async function UsersCoursesList() {
  const result = await getUsersWithCoursesCount();
  const initialUsers: UserWithCourseCount[] = result.success ? (result.data ?? []) : [];

  if (!initialUsers.length) {
    return (
      <p className="py-10 text-center text-sm text-foreground-muted">
        No hay usuarios disponibles.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-black/8 bg-surface-card p-6 dark:border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-black/8 dark:border-white/10">
          <tr>
            <th className="pb-4 text-left font-semibold text-foreground">
              Usuario
            </th>
            <th className="pb-4 text-left font-semibold text-foreground">
              Email
            </th>
            <th className="pb-4 text-center font-semibold text-foreground">
              Cursos
            </th>
            <th className="pb-4 text-right font-semibold text-foreground">
              Acción
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/8 dark:divide-white/10">
          {initialUsers.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-surface-low/50 transition-colors"
            >
              <td className="py-4 text-foreground font-medium">
                {user.name} {user.lastname}
              </td>
              <td className="py-4 text-foreground-muted">{user.email}</td>
              <td className="py-4 text-center">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
                  {user._count.courses}
                </span>
              </td>
              <td className="py-4 text-right">
                <Link href={`/admin/cursos/${user.id}`}>
                  <button className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                    Ver cursos
                    <FiChevronRight size={14} />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}
