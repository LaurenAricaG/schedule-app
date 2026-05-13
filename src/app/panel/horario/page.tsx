import { Suspense } from "react";
import UserCoursesDetail from "@/components/Courses/UserCoursesDetail";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { getCoursesByUser, getScheduleByUser } from "@/lib/courses";
import { ScheduleSkeleton } from "@/components/ui/Skeletons";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
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
      isAdmin={false}
      isRouted={true}
      initialView="schedule"
    />
  );
}

export default async function PanelSchedulePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user.id);

  return (
    <section className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Panel", href: "/panel" }, { label: "Mi Horario" }]}
      />

      <ErrorBoundary variant="compact" title="No se pudo cargar el horario">
        <Suspense fallback={<ScheduleSkeleton />}>
          <ScheduleLoader userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
