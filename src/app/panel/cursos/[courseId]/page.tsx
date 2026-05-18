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
import { prisma } from "@/lib/prisma";

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ page?: string; tab?: string; studentId?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { courseId } = await params;
  const resolvedSearchParams = await searchParams;
  const { page: pageStr, tab = "active", studentId: studentIdParam } = resolvedSearchParams;

  const id = parseInt(courseId);
  const page = parseInt(pageStr || "1");

  const courseResult = await getCourseById(id);

  if (!courseResult.success || !courseResult.data) {
    redirect("/panel/cursos");
  }

  const course = courseResult.data;
  let studentName = "";
  let isParentView = false;

  if (session.user.rol === "apoderado") {
    if (!studentIdParam) {
      redirect("/panel");
    }
    const studentId = parseInt(studentIdParam as string);
    // 1. Validar que el estudiante esté vinculado a este apoderado
    const student = await prisma.user.findFirst({
      where: {
        id: studentId,
        apoderadoId: parseInt(session.user.id),
        deletedAt: null,
        status: true,
      },
    });
    if (!student) {
      redirect("/panel");
    }
    // 2. Validar que el curso pertenezca a este estudiante
    if (course.user.id !== studentId) {
      redirect(`/panel/cursos?studentId=${studentId}`);
    }
    studentName = ` de ${student.name}`;
    isParentView = true;
  } else if (session.user.rol === "docente") {
    redirect("/panel");
  } else {
    // Si es estudiante regular, validar que sea el dueño del curso
    if (course.user.id !== parseInt(session.user.id)) {
      redirect("/panel/cursos");
    }
  }

  const isOwner = !isParentView && String(session.user.id) === String(course.user.id);
  const coursesListHref = isParentView ? `/panel/cursos?studentId=${studentIdParam}` : "/panel/cursos";

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <Breadcrumbs
        items={[
          { label: "Panel", href: "/panel" },
          { label: `Cursos${studentName}`, href: coursesListHref },
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
        <TaskHeader courseId={id} hideAddButton={isParentView} />
        
        <Suspense key={`${id}-${page}-${tab}`} fallback={<TasksSkeleton minimal isAdmin={false} />}>
          <TaskContainer courseId={id} page={page} tab={tab} isAdminView={isParentView} />
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
      hideHeader={true}
      isAdminView={isAdminView}
    />
  );
}
