import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { Dispatch, SetStateAction, useEffect } from "react";

export function TablePagination({ data, page, size, setPage, paginated, search, filter }: {
    data: any[];
    paginated: any[];
    page: number;
    size: number;
    setPage: Dispatch<SetStateAction<number>>;
    search?: string;
    filter?:  string;
}) {
    const totalPages = Math.ceil((data?.length ?? 0) / size);

    const createPageNumbers = () => {
        const pages: (number | string)[] = [];

        // Always include First part (0)
        if (page > 2) {
            pages.push("start-ellipsis"); // leading ellipsis
        }

        // Determine window around current page
        const start = Math.max(0, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Ending ellipsis
        if (page < totalPages - 3) {
            pages.push("end-ellipsis");
        }

        return pages;
    };

    const pageNumbers = createPageNumbers();

    useEffect(() => {
        setPage(0);
    }, [filter, search, data.length]);

    return (
        <div className="flex-center-y justify-between max-md:flex-col max-sm:gap-2">
            <div className="text-sm text-gray">
                {(() => {
                    const start = page * size + 1;
                    const end = page * size + paginated.length;
                    return `Showing ${start}-${end} of ${data.length} items`;
                })()}
            </div>

            <Pagination className="justify-end">
                <PaginationContent>

                    {/* First */}
                    <PaginationItem className="cursor-pointer">
                        <PaginationLink
                            onClick={() => setPage(0)}
                            aria-disabled={page === 0}
                        >
                            First
                        </PaginationLink>
                    </PaginationItem>

                    {/* Prev */}
                    <PaginationItem className="cursor-pointer">
                        <PaginationPrevious
                            onClick={() => setPage(p => Math.max(p - 1, 0))}
                            aria-disabled={page === 0}
                        />
                    </PaginationItem>

                    {/* Page window */}
                    {pageNumbers.map((p, i) => (
                        <PaginationItem key={i}>
                            {(p === "start-ellipsis" || p === "end-ellipsis") ? (
                                <span className="px-2 text-gray-500">…</span>
                            ) : (
                                <PaginationLink
                                    onClick={() => setPage(p as number)}
                                    isActive={p === page}
                                    className={ `cursor-pointer ${p === page && "!bg-darkbrown text-white"}` }
                                >
                                    {(p as number) + 1}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    {/* Next */}
                    <PaginationItem className="cursor-pointer">
                        <PaginationNext
                            onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                            aria-disabled={page >= totalPages - 1}
                        />
                    </PaginationItem>

                    {/* Last */}
                    <PaginationItem className="cursor-pointer">
                        <PaginationLink
                            onClick={() => setPage(totalPages - 1)}
                            aria-disabled={page >= totalPages - 1}
                        >
                            Last
                        </PaginationLink>
                    </PaginationItem>

                </PaginationContent>
            </Pagination>
        </div>
    );
}
