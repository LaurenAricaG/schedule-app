import { cn } from "@/utils/cn.utils";

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
        <div className="min-w-[600px]">
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

export function UserCoursesDetailSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-64 rounded bg-black/10 dark:bg-white/10" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-black/10 dark:bg-white/10" />
        <div className="h-8 w-28 rounded-lg bg-black/10 dark:bg-white/10" />
      </div>
      <TableSkeleton rows={rows} />
    </div>
  );
}
