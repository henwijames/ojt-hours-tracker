import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { router } from '@inertiajs/react';

interface PaginationComponentProps {
    links: { label: string; url: string | null; active: boolean }[];
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    currentPage: number | null;
    lastPage: number | null;
}

export default function PaginationComponent({ links, prevPageUrl, nextPageUrl, currentPage, lastPage }: PaginationComponentProps) {
    const handlePagination = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };
    return (
        <Pagination className="flex justify-between">
            <div className="text-sm text-gray-500">
                Page {currentPage} of {lastPage}
            </div>
            <PaginationContent>
                {prevPageUrl && (
                    <PaginationItem>
                        <PaginationPrevious className="cursor-pointer" onClick={() => handlePagination(prevPageUrl)} />
                    </PaginationItem>
                )}

                {links
                    .filter((link) => link.label.match(/^\d+$/))
                    .map((link, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink className="cursor-pointer" isActive={link.active} onClick={() => handlePagination(link.url)}>
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                {nextPageUrl && (
                    <PaginationItem>
                        <PaginationNext className="cursor-pointer" onClick={() => handlePagination(nextPageUrl)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
