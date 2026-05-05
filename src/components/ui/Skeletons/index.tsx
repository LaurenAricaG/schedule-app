import React from "react";

export function RolesSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
    </section>
  );
}

export function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-surface-card p-6 dark:border-white/10 animate-pulse">
      <div className="overflow-x-auto">
        <div className="min-w-150">
          <div className="mb-6 flex justify-between">
            <div className="h-6 w-1/4 rounded bg-black/10 dark:bg-white/10" />
            <div className="h-6 w-1/4 rounded bg-black/10 dark:bg-white/10" />
            <div className="h-6 w-16 rounded bg-black/10 dark:bg-white/10" />
            <div className="h-6 w-24 rounded bg-black/10 dark:bg-white/10" />
          </div>
          <div className="space-y-4">
            {[...Array(rows)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5"
              >
                <div className="h-4 w-1/4 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-4 w-1/4 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
                <div className="h-8 w-24 rounded-lg bg-black/10 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserCoursesDetailSkeleton({ rows = 6 }: { rows?: number }) {
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
          <div className="h-10 w-32 rounded-lg bg-black/10 dark:bg-white/10" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl bg-surface-card p-5 h-56"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-black/10 dark:bg-white/10" />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
                <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
              </div>
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
              <div key={j} className="h-24 w-full rounded-xl bg-black/10 dark:bg-white/10" />
            ))}
          </div>
        ))}
      </div>
      
      {/* Mobile skeleton placeholder */}
      <div className="lg:hidden space-y-4">
        <div className="grid grid-cols-5 gap-2">
           {[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-black/10 dark:bg-white/10" />)}
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 w-full rounded-xl bg-black/10 dark:bg-white/10" />
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

export function TasksSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header & Controls Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-10 w-64 rounded-xl bg-black/10 dark:bg-white/10" />
        <div className="h-10 w-36 rounded-lg bg-black/10 dark:bg-white/10" />
      </div>

      {/* Task List Skeleton */}
      <div className="grid gap-3">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-surface-card/50"
          >
            <div className="h-6 w-6 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="grow space-y-2">
              <div className="h-4 w-1/2 rounded bg-black/10 dark:bg-white/10" />
              <div className="h-3 w-1/4 rounded bg-black/10 dark:bg-white/10" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
              <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
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



