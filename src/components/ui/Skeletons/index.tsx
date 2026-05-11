import { cn } from "@/utils/cn.utils";

export function RolesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <article
          key={i}
          className="flex flex-col rounded-xl border border-black/6 bg-surface-card p-5 dark:border-white/8 animate-pulse"
        >
          <div className="mb-5 flex items-start justify-between">
            <div className="h-12 w-12 rounded-lg bg-black/10 dark:bg-white/10" />
            <div className="h-8 w-16 rounded bg-black/10 dark:bg-white/10" />
          </div>
          <div className="mb-2 h-5 w-24 rounded bg-black/10 dark:bg-white/10" />
          <div className="mb-6 h-4 w-3/4 rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-auto flex items-center justify-between border-t border-black/6 pt-4 dark:border-white/8">
            <div className="h-3 w-16 rounded bg-black/10 dark:bg-white/10" />
            <div className="h-5 w-16 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function UserCoursesDetailSkeleton({
  rows = 6,
  isAdmin = false,
}: {
  rows?: number;
  isAdmin?: boolean;
}) {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-48 rounded bg-black/10 dark:bg-white/10" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded-lg bg-black/10 dark:bg-white/10" />
          {isAdmin && (
            <div className="h-10 w-32 rounded-lg bg-black/10 dark:bg-white/10" />
          )}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl bg-surface-card p-5 h-56 border border-black/5 dark:border-white/5"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-black/10 dark:bg-white/10" />
              {isAdmin && (
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
                  <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
                </div>
              )}
            </div>
            <div className="h-5 w-3/4 rounded bg-black/10 dark:bg-white/10 mb-3" />
            <div className="h-4 w-1/2 rounded bg-black/10 dark:bg-white/10 mb-auto" />
            <div className="mt-auto flex items-center justify-between border-t border-black/6 pt-4 dark:border-white/8">
              <div className="h-5 w-16 rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-8 w-20 rounded-lg bg-black/10 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between py-4 mt-2">
        <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, j) => (
            <div
              key={j}
              className="h-10 w-10 rounded-lg bg-black/10 dark:bg-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function UsersListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="flex flex-col gap-4">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card p-5 ghost-border"
          >
            {/* User Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-black/10 dark:bg-white/10" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-3 w-24 rounded bg-black/10 dark:bg-white/10" />
              </div>
            </div>

            {/* Courses Count & Actions Wrapper */}
            <div className="flex flex-row items-end sm:items-center justify-between w-full sm:flex-2 mt-4 sm:mt-0">
              {/* Courses Count */}
              <div className="flex flex-col sm:items-center justify-center flex-1 gap-2">
                <div className="h-3 w-20 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-6 w-12 rounded bg-black/10 dark:bg-white/10" />
              </div>

              {/* Actions */}
              <div className="flex justify-end flex-1">
                <div className="h-10 w-32 rounded-lg bg-black/10 dark:bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between py-4 mt-2">
        <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, j) => (
            <div
              key={j}
              className="h-10 w-10 rounded-lg bg-black/10 dark:bg-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableUsersSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Header & Controls Skeleton */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
        <div className="h-10 w-64 rounded-xl bg-black/10 dark:bg-white/10" />
        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-40 rounded-lg bg-black/10 dark:bg-white/10" />
        </div>
      </div>

      <div className="card ghost-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/8 dark:border-white/10">
                <th className="px-6 py-4 text-left"><div className="h-4 w-20 rounded bg-black/10 dark:bg-white/10" /></th>
                <th className="px-6 py-4 text-left"><div className="h-4 w-20 rounded bg-black/10 dark:bg-white/10" /></th>
                <th className="px-6 py-4 text-left"><div className="h-4 w-20 rounded bg-black/10 dark:bg-white/10" /></th>
                <th className="px-6 py-4 text-left"><div className="h-4 w-16 rounded bg-black/10 dark:bg-white/10" /></th>
                <th className="px-6 py-4 text-left"><div className="h-4 w-16 rounded bg-black/10 dark:bg-white/10" /></th>
                <th className="px-6 py-4 text-left"><div className="h-4 w-16 rounded bg-black/10 dark:bg-white/10" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(count)].map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-black/5 dark:border-white/5"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-black/10 dark:bg-white/10" />
                      <div className="h-4 w-32 rounded bg-black/10 dark:bg-white/10" />
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
                  </td>
                  <td className="px-6 py-3">
                    <div className="h-4 w-24 rounded bg-black/10 dark:bg-white/10" />
                  </td>
                  <td className="px-6 py-3">
                    <div className="h-6 w-20 rounded-full bg-black/10 dark:bg-white/10" />
                  </td>
                  <td className="px-6 py-3">
                    <div className="h-6 w-16 rounded-full bg-black/10 dark:bg-white/10" />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
                      <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between py-4 mt-2">
        <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, j) => (
            <div
              key={j}
              className="h-10 w-10 rounded-lg bg-black/10 dark:bg-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScheduleCardSkeleton() {
  return (
    <div className="card p-6 ghost-border animate-pulse">
      {/* UserSchedule Header Placeholder */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-6 w-24 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-16 rounded bg-black/10 dark:bg-white/10" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-black/10 dark:bg-white/10" />
      </div>

      {/* Days Header Placeholder (Desktop) */}
      <div className="hidden lg:grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="h-16 w-full rounded-xl bg-black/5 dark:bg-white/5 mb-3" />
            {[...Array(6)].map((_, j) => (
              <div
                key={j}
                className="h-24 w-full rounded-xl bg-black/10 dark:bg-white/10"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Mobile skeleton placeholder */}
      <div className="lg:hidden space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-xl bg-black/10 dark:bg-white/10"
            />
          ))}
        </div>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-24 w-full rounded-xl bg-black/10 dark:bg-white/10"
          />
        ))}
      </div>
    </div>
  );
}

export function ScheduleSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* UserCoursesDetail Header Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-48 rounded-lg bg-black/10 dark:bg-white/10" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded-lg bg-black/10 dark:bg-white/10" />
        </div>
      </div>

      <ScheduleCardSkeleton />
    </div>
  );
}

export function TasksSkeleton({
  count = 6,
  isAdmin = false,
  minimal = false,
}: {
  count?: number;
  isAdmin?: boolean;
  minimal?: boolean;
}) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Cabecera Skeleton */}
      {!minimal && !isAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="h-8 w-40 rounded-xl bg-black/10 dark:bg-white/10" />
            <div className="h-4 w-56 rounded bg-black/10 dark:bg-white/10" />
          </div>
          <div className="h-10 w-44 rounded-lg bg-black/10 dark:bg-white/10" />
        </div>
      )}

      {/* 2. Tabs Skeleton */}
      {!minimal && (
        <div className="flex items-center gap-7 border-b border-foreground/5 pb-px">
          <div className="pb-4 relative">
            <div className="h-4 w-24 rounded bg-black/10 dark:bg-white/10" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/10 dark:bg-white/10" />
          </div>
          <div className="pb-4">
            <div className="h-4 w-28 rounded bg-black/5 dark:bg-white/5" />
          </div>
        </div>
      )}

      {/* 3. Table Headers Skeleton (Desktop) */}
      <div className="hidden md:grid grid-cols-[1fr_160px_160px_200px] gap-6 px-6">
        <div className="h-3 w-32 rounded bg-black/5 dark:bg-white/5" />
        <div className="flex justify-center">
          <div className="h-3 w-24 rounded bg-black/5 dark:bg-white/5" />
        </div>
        <div className="flex justify-center">
          <div className="h-3 w-16 rounded bg-black/5 dark:bg-white/5" />
        </div>
        <div className="flex justify-center">
          <div className="h-3 w-20 rounded bg-black/5 dark:bg-white/5" />
        </div>
      </div>

      {/* 4. Task List Skeleton */}
      <div className="grid gap-4">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="group grid grid-cols-1 md:grid-cols-[1fr_160px_160px_200px] items-center gap-4 md:gap-6 p-5 sm:p-6 rounded-3xl border border-black/5 dark:border-white/5 bg-surface-card"
          >
            {/* Info Column */}
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-black/10 dark:bg-white/10 shrink-0" />
              <div className="grow space-y-2">
                <div className="h-3 w-20 rounded bg-black/5 dark:bg-white/5" />
                <div className="h-5 w-3/4 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-black/5 dark:bg-white/5" />
              </div>
            </div>

            {/* Date Column */}
            <div className="hidden md:flex justify-center border-l border-foreground/5 px-4">
              <div className="h-4 w-24 rounded bg-black/10 dark:bg-white/10" />
            </div>

            {/* Status Column */}
            <div className="hidden md:flex justify-center border-l border-foreground/5 px-4">
              <div className="h-9 w-36 rounded-full bg-black/10 dark:bg-white/10" />
            </div>

            {/* Actions Column */}
            <div
              className={cn(
                "flex items-center gap-1 md:pl-4 border-t md:border-t-0 md:border-l border-foreground/5 pt-4 md:pt-0",
                isAdmin ? "justify-center" : "justify-center md:justify-end",
              )}
            >
              {isAdmin ? (
                <div className="h-10 w-10 rounded-2xl bg-black/10 dark:bg-white/10" />
              ) : (
                <>
                  <div className="h-10 w-10 rounded-2xl bg-black/10 dark:bg-white/10" />
                  <div className="h-10 w-10 rounded-2xl bg-black/10 dark:bg-white/10" />
                  <div className="h-10 w-10 rounded-2xl bg-black/10 dark:bg-white/10" />
                  <div className="h-10 w-10 rounded-2xl bg-black/10 dark:bg-white/10" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 5. Pagination Skeleton */}
      <div className="flex items-center justify-between py-4 mt-2">
        <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
        <div className="flex gap-1">
          {[...Array(3)].map((_, j) => (
            <div
              key={j}
              className="h-10 w-10 rounded-lg bg-black/10 dark:bg-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
