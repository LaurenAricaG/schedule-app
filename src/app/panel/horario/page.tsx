import { Suspense } from "react";
import UserCoursesDetail from "@/components/Courses/UserCoursesDetail";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { getCoursesByUser, getScheduleByUser } from "@/lib/courses";
import { ScheduleSkeleton } from "@/components/ui/Skeletons";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { prisma } from "@/lib/prisma";

async function ScheduleLoader({
  userId,
  scheduleHref,
  coursesHref,
}: {
  userId: number;
  scheduleHref?: string;
  coursesHref?: string;
}) {
  const [coursesResult, scheduleResult] = await Promise.all([
    getCoursesByUser(userId, 1, 100),
    getScheduleByUser(userId)
  ]);

  const initialData = coursesResult.success
    ? coursesResult.data
    : { user: null, courses: [], total: 0 };

  const initialSchedules = scheduleResult.success ? scheduleResult.data : [];

  return (
    <UserCoursesDetail
      userId={userId}
      initialData={initialData}
      initialSchedules={initialSchedules}
      isAdmin={false}
      isRouted={true}
      initialView="schedule"
      scheduleHref={scheduleHref}
      coursesHref={coursesHref}
    />
  );
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PanelSchedulePage(props: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const resolvedSearchParams = await props.searchParams;
  const studentIdParam = resolvedSearchParams?.studentId;
  let userId = parseInt(session.user.id);
  let studentName = "";

  if (session.user.rol === "apoderado") {
    if (!studentIdParam) {
      redirect("/panel");
    }
    const studentId = parseInt(studentIdParam as string);
    // Validar que el estudiante esté vinculado a este apoderado
    const student = await prisma.user.findFirst({
      where: {
        id: studentId,
        apoderadoId: userId,
        deletedAt: null,
        status: true,
      },
    });
    if (!student) {
      redirect("/panel");
    }
    userId = studentId;
    studentName = ` de ${student.name}`;
  } else if (session.user.rol === "docente") {
    redirect("/panel");
  }

  const scheduleHref = session.user.rol === "apoderado" ? `/panel/horario?studentId=${userId}` : "/panel/horario";
  const coursesHref = session.user.rol === "apoderado" ? `/panel/cursos?studentId=${userId}` : "/panel/cursos";

  return (
    <section className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Panel", href: "/panel" },
          { label: `Horario${studentName}` },
        ]}
      />

      <ErrorBoundary variant="compact" title="No se pudo cargar el horario">
        <Suspense fallback={<ScheduleSkeleton />}>
          <ScheduleLoader
            userId={userId}
            scheduleHref={scheduleHref}
            coursesHref={coursesHref}
          />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
