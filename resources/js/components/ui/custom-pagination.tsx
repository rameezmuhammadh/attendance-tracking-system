import * as React from "react";
import { Link } from "@inertiajs/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface CustomPaginationProps {
  links: PaginationLink[];
  params?: Record<string, any>;
  className?: string;
}

export default function CustomPagination({
  links,
  params = {},
  className = "",
}: CustomPaginationProps) {
  // Helper function to build URLs with optional params
  const buildUrlWithParams = (baseUrl: string | null) => {
    if (!baseUrl) return null;

    // Make a copy of `params` without the `page` property
    const filteredParams = { ...params };
    delete filteredParams.page;

    // Construct the URL
    const url = new URL(baseUrl, window.location.origin);
    Object.entries(filteredParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, value);
      }
    });

    return url.toString();
  };

  // Helper to determine if the link is Previous/Next/Ellipsis
  const getLinkType = (label: string) => {
    if (label.includes("&laquo;")) return "previous";
    if (label.includes("&raquo;")) return "next";
    if (label.includes("...")) return "ellipsis";
    return "page";
  };

  // Parse HTML entities in labels
  const parseLabel = (label: string) => {
    if (label.includes("&laquo;")) return "Previous";
    if (label.includes("&raquo;")) return "Next";
    if (label.includes("...")) return "...";
    
    // For numeric pages
    const div = document.createElement('div');
    div.innerHTML = label;
    return div.textContent || label;
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul data-slot="pagination-content" className="flex flex-row items-center gap-1">
        {links.map((link) => {
          const linkType = getLinkType(link.label);
          const parsedLabel = parseLabel(link.label);
          const url = buildUrlWithParams(link.url);

          if (linkType === "previous") {
            return (
              <li data-slot="pagination-item" key={link.label}>
                <Link
                  preserveScroll
                  href={url || "#"}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "default",
                    }),
                    "gap-1 px-2.5 sm:pl-2.5",
                    !link.url && "pointer-events-none opacity-50"
                  )}
                  aria-disabled={!link.url}
                >
                  <ChevronLeftIcon className="size-4" />
                  <span className="hidden sm:block">Previous</span>
                </Link>
              </li>
            );
          }

          if (linkType === "next") {
            return (
              <li data-slot="pagination-item" key={link.label}>
                <Link
                  preserveScroll
                  href={url || "#"}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "default",
                    }),
                    "gap-1 px-2.5 sm:pr-2.5",
                    !link.url && "pointer-events-none opacity-50"
                  )}
                  aria-disabled={!link.url}
                >
                  <span className="hidden sm:block">Next</span>
                  <ChevronRightIcon className="size-4" />
                </Link>
              </li>
            );
          }

          if (linkType === "ellipsis") {
            return (
              <li data-slot="pagination-item" key={link.label}>
                <span
                  aria-hidden
                  data-slot="pagination-ellipsis"
                  className="flex size-9 items-center justify-center"
                >
                  <MoreHorizontalIcon className="size-4" />
                  <span className="sr-only">More pages</span>
                </span>
              </li>
            );
          }

          // Normal page link
          return (
            <li data-slot="pagination-item" key={link.label}>
              <Link
                preserveScroll
                href={url || "#"}
                aria-current={link.active ? "page" : undefined}
                data-slot="pagination-link"
                data-active={link.active}
                aria-disabled={!link.url}
                className={cn(
                  buttonVariants({
                    variant: link.active ? "outline" : "ghost",
                    size: "icon",
                  }),
                  !link.url && "pointer-events-none opacity-50"
                )}
              >
                {parsedLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
