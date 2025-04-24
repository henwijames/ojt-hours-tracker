import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

interface DashboardChartProps {
    data: Array<{ month: string; student: number }>;
    config: ChartConfig;
    className?: string;
}

export function DashboardChart({ data, config, className = 'min-h-[200px] w-full' }: DashboardChartProps) {
    return (
        <ChartContainer config={config} className={className}>
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="student" fill="var(--color-student)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
