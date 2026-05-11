import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getCourseById } from "@/lib/courses";
import { getTasksByCourseId } from "@/lib/tasks";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { TasksSkeleton } from "@/components/ui/Skeletons";
import { FiActivity } from "react-icons/fi";

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ page?: string; tab?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { courseId } = await params;
  const { page: pageStr, tab = "active" } = await searchParams;

  const id = parseInt(courseId);
  const page = parseInt(pageStr || "1");

  const courseResult = await getCourseById(id);

  if (!courseResult.success || !courseResult.data) {
    redirect("/panel/cursos");
  }

  const course = courseResult.data;
  const isOwner = String(session.user.id) === String(course.user.id);

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumbs
        items={[
          { label: "Panel", href: "/panel" },
          { label: "Mis Cursos", href: "/panel/cursos" },
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
            <h1 className="text-3xl font-bold text-foreground">
              {course.name}
            </h1>
            <p className="text-foreground-muted">
              Profesor:{" "}
              <span className="font-semibold text-foreground">
                {course.teacher}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 relative z-10">
          {isOwner && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
              Tu curso personal
            </span>
          )}
        </div>
      </div>

      {/* Task Section */}
      <div className="space-y-4">
        <TaskHeader courseId={id} />
        
        <Suspense key={`${id}-${page}-${tab}`} fallback={<TasksSkeleton minimal isAdmin={false} />}>
          <TaskContainer courseId={id} page={page} tab={tab} />
        </Suspense>
      </div>
    </section>
  );
}

async function TaskContainer({
  courseId,
  page,
  tab,
}: {
  courseId: number;
  page: number;
  tab: string;
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
      hideHeader={true}
    />
  );
}
