// PieChart.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { Cell, Pie, PieChart as RechartsPieChart } from 'recharts';

interface StatusData {
    status: string;
    count: number;
    color: string;
}

interface StudentPieChartProps {
    title: string;
    description: string;
    data: StatusData[];
    config?: ChartConfig;
}

export function StudentStatusChart({ title, description, data, config }: StudentPieChartProps) {
    // Calculate statistics
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);
    const primaryPercentage = totalCount > 0 ? ((data[0].count / totalCount) * 100).toFixed(1) : '0'; // If totalCount is 0, return 0%

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={config || {}} className="mx-auto aspect-square max-h-[250px]">
                    <RechartsPieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={data} dataKey="count" nameKey="status">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </RechartsPieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    {primaryPercentage}% of students are {data[0].status.toLowerCase()} <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Total of {totalCount} students in the system</div>
            </CardFooter>
        </Card>
    );
}
