"use client";

import LazyLink from "@/components/ui/LazyLink";
import { usePathname, useSearchParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/utils/cn.utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  itemName?: string;
}

export default function Pagination({
  totalPages,
  currentPage,
  totalItems,
  itemsPerPage,
  itemName = "usuarios",
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages - 1, totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const allPages = generatePagination(currentPage, totalPages);

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mt-2">
      <div className="text-sm text-foreground-muted">
        Mostrando <span className="font-semibold text-foreground">{startIndex} - {endIndex}</span> de {totalItems.toLocaleString()} {itemName}
      </div>

      <div className="flex items-center gap-1">
        <LazyLink
          href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-lg ghost-border bg-surface-card transition-colors",
            currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-surface-low"
          )}
          aria-disabled={currentPage <= 1}
        >
          <FiChevronLeft className="h-5 w-5" />
        </LazyLink>

        {allPages.map((page, i) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${i}`} className="px-2 text-foreground-muted">
                ...
              </span>
            );
          }

          return (
            <LazyLink
              key={`page-${page}`}
              href={createPageURL(page)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-primary text-white shadow-sm"
                  : "text-foreground hover:bg-surface-low"
              )}
            >
              {page}
            </LazyLink>
          );
        })}

        <LazyLink
          href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-lg ghost-border bg-surface-card transition-colors",
            currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-surface-low"
          )}
          aria-disabled={currentPage >= totalPages}
        >
          <FiChevronRight className="h-5 w-5" />
        </LazyLink>
      </div>
    </div>
  );
}
