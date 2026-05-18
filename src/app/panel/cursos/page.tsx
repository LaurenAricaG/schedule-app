import { Suspense } from "react";
import UserCoursesDetail from "@/components/Courses/UserCoursesDetail";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { getCoursesByUser } from "@/lib/courses";
import { UserCoursesDetailSkeleton } from "@/components/ui/Skeletons";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

async function CoursesLoader({
  userId,
  page,
}: {
  userId: number;
  page: number;
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
    />
  );
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PanelCoursesPage(props: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  if (session.user.rol === "docente" || session.user.rol === "apoderado") {
    redirect("/panel");
  }

  const userId = parseInt(session.user.id);
  const resolvedSearchParams = await props.searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  return (
    <section className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Panel", href: "/panel" }, { label: "Mis Cursos" }]}
      />

      <ErrorBoundary variant="compact" title="No se pudieron cargar tus cursos">
        <Suspense key={currentPage} fallback={<UserCoursesDetailSkeleton />}>
          <CoursesLoader userId={userId} page={currentPage} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
