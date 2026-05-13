import { Suspense } from "react";
import UserCoursesDetail from "@/components/Courses/UserCoursesDetail";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { getCoursesByUser, getScheduleByUser } from "@/lib/courses";
import { ScheduleSkeleton } from "@/components/ui/Skeletons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

async function ScheduleLoader({ userId }: { userId: number }) {
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
      isAdmin={true}
      isRouted={true}
      initialView="schedule"
      scheduleHref={`/admin/cursos/${userId}/horario`}
      coursesHref={`/admin/cursos/${userId}`}
    />
  );
}

export default async function AdminUserSchedulePage(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const userId = parseInt(params.userId);

  return (
    <section className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Cursos", href: "/admin/cursos" },
          { label: "Lista de cursos", href: `/admin/cursos/${userId}` },
          { label: "Horario" },
        ]}
      />

      <ErrorBoundary variant="compact" title="No se pudo cargar el horario">
        <Suspense fallback={<ScheduleSkeleton />}>
          <ScheduleLoader userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
