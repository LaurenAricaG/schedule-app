import { auth } from "@/lib/auth";
import { getCourseById } from "@/lib/courses";
import { getTasksByCourseId } from "@/lib/tasks";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FiActivity } from "react-icons/fi";
import { Suspense } from "react";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { TasksSkeleton } from "@/components/ui/Skeletons";

export default async function AdminCourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string; courseId: string }>;
  searchParams: Promise<{ page?: string; tab?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.rol !== "admin") redirect("/panel");

  const { userId, courseId } = await params;
  const { page: pageStr, tab = "active" } = await searchParams;

  const id = parseInt(courseId);
  const page = parseInt(pageStr || "1");

  const courseResult = await getCourseById(id);

  if (!courseResult.success || !courseResult.data) {
    redirect(`/admin/cursos/${userId}`);
  }

  const course = courseResult.data;
  const studentName = `${course.user.name} ${course.user.lastname}`;

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Cursos", href: "/admin/cursos" },
          { label: studentName, href: `/admin/cursos/${userId}` },
          { label: course.name },
        ]}
      />

      {/* Course Header */}
      <div
        className="card p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative"
        style={{ borderColor: `${course.color}33` }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: course.color || "var(--primary)" }}
        />

        <div className="flex items-center gap-5 relative z-10">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5"
            style={{ backgroundColor: course.color || "var(--primary)" }}
          >
            <FiActivity size={32} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {course.name}
              </h1>
            </div>
            <p className="text-foreground-muted">
              Estudiante:{" "}
              <span className="font-semibold text-foreground">
                {studentName}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-role-admin/10 text-role-admin text-[10px] font-black uppercase tracking-wider">
            Modo Admin
          </span>
        </div>
      </div>

      {/* Task Section */}
      <div className="space-y-4">
        <TaskHeader courseId={id} isAdminView={true} />

        <Suspense key={`${id}-${page}-${tab}`} fallback={<TasksSkeleton minimal isAdmin={true} />}>
          <TaskContainer courseId={id} page={page} tab={tab} isAdminView={true} />
        </Suspense>
      </div>
    </section>
  );
}

async function TaskContainer({
  courseId,
  page,
  tab,
  isAdminView = false,
}: {
  courseId: number;
  page: number;
  tab: string;
  isAdminView?: boolean;
}) {
  const tasksResult = await getTasksByCourseId(courseId, page, 6, tab);

  const tasksData = tasksResult.success
    ? tasksResult
    : { data: [], totalPages: 1, totalTasks: 0 };

  return (
    <TaskList
      courseId={courseId}
      initialTasks={tasksData.data || []}
      totalPages={tasksData.totalPages || 1}
      currentPage={page}
      totalTasks={tasksData.totalTasks || 0}
      isAdminView={isAdminView}
      hideHeader={true}
    />
  );
}
