import { Card, CardContent } from '@/components/ui/card';
import { FileUser, GraduationCapIcon, School } from 'lucide-react';

interface SectionCardsProps {
    name: string;
}

export function SectionCards({ name }: SectionCardsProps) {
    return (
        <div className="px-4 lg:px-6">
            <h1 className="mb-2 text-2xl font-semibold">
                Welcome, <span className="text-primary capitalize">{name}</span> !
            </h1>
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xs text-gray-50">Coordinators</h2>
                            <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">35</p>
                        </div>

                        <FileUser className="h-12 w-12" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xs text-gray-50">Students</h2>
                            <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">298</p>
                        </div>

                        <GraduationCapIcon className="h-12 w-12" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xs text-gray-50">Department</h2>
                            <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">9</p>
                        </div>

                        <School className="h-12 w-12" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xs text-gray-50">Programs</h2>
                            <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">23</p>
                        </div>

                        <School className="h-12 w-12" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
