import { User } from "@/types/definitions";
import LazyLink from "@/components/ui/LazyLink";
import { getUsersWithCoursesCount } from "@/lib/courses";
import Pagination from "@/components/ui/Pagination";
import { FiUser, FiArrowRight, FiBook } from "react-icons/fi";

type UserWithCourseCount = User & {
  _count: {
    courses: number;
  };
};

interface UsersCoursesListProps {
  page?: number;
}

/**
 * Componente que muestra una lista de usuarios y la cantidad de cursos que tienen asignados.
 * Es un Server Component asÃ­ncrono que obtiene sus propios datos.
 */
export default async function UsersCoursesList({
  page = 1,
}: UsersCoursesListProps) {
  const limit = 4; // Based on the image showing 1-4
  const result = await getUsersWithCoursesCount(page, limit);

  const initialUsers: UserWithCourseCount[] = result.success
    ? (result.data?.users ?? [])
    : [];
  const totalItems = result.success ? (result.data?.total ?? 0) : 0;
  const totalPages = Math.ceil(totalItems / limit);

  if (!initialUsers.length) {
    return (
      <p className="py-10 text-center text-sm text-foreground-muted">
        No hay usuarios disponibles.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {initialUsers.map((user) => (
          <div
            key={user.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card p-5 ghost-border transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* User Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-container">
                <FiUser className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-base">
                  {user.name} {user.lastname}
                </span>
                <span className="text-sm text-foreground-muted">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Courses Count & Actions Wrapper */}
            <div className="flex flex-row items-end sm:items-center justify-between w-full sm:flex-2 mt-4 sm:mt-0">
              {/* Courses Count */}
              <div className="flex flex-col sm:items-center justify-center flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted mb-1">
                  N° cursos
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-foreground">
                    {user._count.courses.toString().padStart(2, "0")}
                  </span>
                  <FiBook className="h-4 w-4 text-primary dark:text-primary-container" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end flex-1">
                <LazyLink
                  href={`/admin/cursos/${user.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-container dark:hover:bg-primary/30 cursor-pointer"
                >
                  Gestionar
                  <FiArrowRight className="h-4 w-4" />
                </LazyLink>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        totalItems={totalItems}
        itemsPerPage={limit}
        itemName="usuarios"
      />
    </div>
  );
}
