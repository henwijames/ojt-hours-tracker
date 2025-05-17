import { TableCell, TableRow } from '@/components/ui/table';

export default function StudentSkeleton() {
    return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
            <TableCell>
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
            </TableCell>
            <TableCell>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            </TableCell>
            <TableCell>
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
            </TableCell>
            <TableCell>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            </TableCell>
            <TableCell>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                </div>
            </TableCell>
        </TableRow>
    ));
}
