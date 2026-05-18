import { Suspense } from "react";
import UserCoursesDetail from "@/components/Courses/UserCoursesDetail";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { getCoursesByUser } from "@/lib/courses";
import { UserCoursesDetailSkeleton } from "@/components/ui/Skeletons";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { prisma } from "@/lib/prisma";

async function CoursesLoader({
  userId,
  page,
  scheduleHref,
  coursesHref,
}: {
  userId: number;
  page: number;
  scheduleHref?: string;
  coursesHref?: string;
}) {
  const result = await getCoursesByUser(userId, page, 6);
  const initialData = result.success
    ? result.data
    : { user: null, courses: [], total: 0 };

  return (
    <UserCoursesDetail
      userId={userId}
      initialData={initialData}
      page={page}
      isAdmin={false}
      isRouted={true}
      initialView="courses"
      scheduleHref={scheduleHref}
      coursesHref={coursesHref}
    />
  );
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PanelCoursesPage(props: {
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

  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const scheduleHref = session.user.rol === "apoderado" ? `/panel/horario?studentId=${userId}` : "/panel/horario";
  const coursesHref = session.user.rol === "apoderado" ? `/panel/cursos?studentId=${userId}` : "/panel/cursos";

  return (
    <section className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Panel", href: "/panel" },
          { label: `Cursos${studentName}` },
        ]}
      />

      <ErrorBoundary variant="compact" title="No se pudieron cargar tus cursos">
        <Suspense key={currentPage} fallback={<UserCoursesDetailSkeleton />}>
          <CoursesLoader
            userId={userId}
            page={currentPage}
            scheduleHref={scheduleHref}
            coursesHref={coursesHref}
          />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
