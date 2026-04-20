"use client";

import Link from "next/link";

interface TitleProps {
  title: string;
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
}

const Title = ({ title, breadcrumbs }: TitleProps) => {
  return (
    <div className="space-y-4">
      {/* Título Principal */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-gray-900 dark:hover:text-gray-200 hover:underline transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-gray-300">
                  {crumb.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="text-gray-400 dark:text-gray-600">/</span>
              )}
            </div>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Title;
