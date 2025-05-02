import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface PaginationComponentProps {
    links: { label: string; url: string | null; active: boolean }[];
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    currentPage: number | null;
    lastPage: number | null;
    handlePagination: (url: string | null) => void;
}

export default function PaginationComponent({ links, prevPageUrl, nextPageUrl, currentPage, lastPage, handlePagination }: PaginationComponentProps) {
    return (
        <Pagination className="flex justify-between">
            <div className="text-sm text-gray-500">
                Page {currentPage} of {lastPage}
            </div>
            <PaginationContent>
                {prevPageUrl && (
                    <PaginationItem>
                        <PaginationPrevious onClick={() => handlePagination(prevPageUrl)} />
                    </PaginationItem>
                )}

                {links
                    .filter((link) => link.label.match(/^\d+$/))
                    .map((link, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink isActive={link.active} onClick={() => handlePagination(link.url)}>
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                {nextPageUrl && (
                    <PaginationItem>
                        <PaginationNext onClick={() => handlePagination(nextPageUrl)} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
