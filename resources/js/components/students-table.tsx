import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Students } from '@/types';

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface StudentTableProps {
    students: PaginatedResponse<Students>;
}

const UserStatusBadge = ({ status }: { status: string }) => {
    const getVariant = () => {
        if (status === 'active') return 'default';
        if (status === 'inactive') return 'destructive';
        return 'secondary';
    };

    const isPending = status === 'pending';

    return (
        <Badge variant={getVariant()} className={`text-xs capitalize dark:text-white ${isPending ? 'bg-yellow-500 text-white' : ''}`}>
            {status}
        </Badge>
    );
};

export function StudentTable({ students }: StudentTableProps) {
    const studentData = students?.data ?? [];

    return (
        <>
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentData.length > 0 ? (
                            studentData.map((student) => (
                                <TableRow key={student?.id}>
                                    <TableCell className="w-[100px]">{student.student?.student_id}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.student?.department.name}</TableCell>
                                    <TableCell>{student.student?.program.name}</TableCell>
                                    <TableCell>
                                        <UserStatusBadge status={student.student?.status ?? 'unknown'} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div>
                    {students.prev_page_url && (
                        <a href={students.prev_page_url} className="text-primary">
                            Previous
                        </a>
                    )}
                    {students.next_page_url && (
                        <a href={students.next_page_url} className="text-primary ml-4">
                            Next
                        </a>
                    )}
                </div>
                <div className="text-sm text-gray-500">
                    Page {students.current_page} of {students.last_page}
                </div>
            </div>
        </>
    );
}
