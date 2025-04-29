import { Card, CardContent } from '@/components/ui/card';
import { FileUser, GraduationCapIcon, School } from 'lucide-react';

type SectionCardsProps = {
    coordinatorCount: number;
    studentCount: number;
    departmentCount: number;
    programCount: number;
};

export function SectionCards({ coordinatorCount, studentCount, departmentCount, programCount }: SectionCardsProps) {
    return (
        <>
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h2 className="text-primary text-xs dark:text-gray-50">Coordinators</h2>
                            <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{coordinatorCount}</p>
                        </div>

                        <FileUser className="h-12 w-12" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h2 className="text-primary text-xs dark:text-gray-50">Students</h2>
                            <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{studentCount}</p>
                        </div>

                        <GraduationCapIcon className="h-12 w-12" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h2 className="text-primary text-xs dark:text-gray-50">Department</h2>
                            <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{departmentCount}</p>
                        </div>

                        <School className="h-12 w-12" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h2 className="text-primary text-xs dark:text-gray-50">Programs</h2>
                            <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{programCount}</p>
                        </div>

                        <School className="h-12 w-12" />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
