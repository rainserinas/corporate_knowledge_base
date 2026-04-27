"use client";

// components/Pagination.tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
    const searchParams = useSearchParams();
    if (totalPages <= 1) return null;

    const getPageLink = (page: number) => `/?page=${page}`;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `/?${params.toString()}`;
    };

    return (
        <div className="mt-12 flex items-center justify-center gap-2">
            {/* Previous Button */}
            <Link
                href={getPageLink(currentPage - 1)}
                className={`p-2 rounded-lg border transition-all ${currentPage <= 1
                    ? "pointer-events-none opacity-40 border-slate-200"
                    : "border-slate-200 hover:border-indigo-300 hover:text-indigo-600 active:scale-95"
                    }`}
            >
                <ChevronLeft className="h-5 w-5" />
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {/* Ensure we only create buttons for existing pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Link
                        key={pageNum}
                        href={createPageURL(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${pageNum === currentPage
                            ? "bg-indigo-600 text-white shadow-md"
                            : "text-slate-500 hover:bg-slate-100 border border-transparent"
                            }`}
                    >
                        {pageNum}
                    </Link>
                ))}
            </div>

            {/* Next Button */}
            <Link
                href={getPageLink(currentPage + 1)}
                className={`p-2 rounded-lg border transition-all ${currentPage >= totalPages
                    ? "pointer-events-none opacity-40 border-slate-200"
                    : "border-slate-200 hover:border-indigo-300 hover:text-indigo-600 active:scale-95"
                    }`}
            >
                <ChevronRight className="h-5 w-5" />
            </Link>
        </div>
    );
}