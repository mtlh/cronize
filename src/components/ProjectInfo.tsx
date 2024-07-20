import type {Project } from '@/db/types';
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart"
import { Button } from './ui/button';
import { navigate } from 'astro:transitions/client';

const cronjobs = [
  {
      id: 1,
      name: "cronjob-1",
      dailyTime: "10:00:00 AM",
      interval: "daily",
      lastRunTime: "2023-07-20 10:00:00 AM",
      lastRunStatus: "200",
  }
]

const chartData = [
  { month: "January", desktop: 186, mobile: 80, other: 45 },
  { month: "February", desktop: 305, mobile: 200, other: 100 },
  { month: "March", desktop: 237, mobile: 120, other: 150 },
  { month: "April", desktop: 73, mobile: 190, other: 50 },
  { month: "May", desktop: 209, mobile: 130, other: 100 },
  { month: "June", desktop: 214, mobile: 140, other: 160 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const ListComponent = ({id}: {id: number}) => {
  const [data, setData] = useState<Project>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/getProjectInfo?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="grid items-center gap-4">
        <h1 className="font-semibold italic text-4xl">{data?.name}</h1>
        <p className='text-lg'>{data?.description}</p>
        <Table>
            <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Cronjob Name</TableHead>
                  <TableHead>Daily Time</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Last Run Time</TableHead>
                  <TableHead >Last Run Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cronjobs.map((cron) => (
                <TableRow key={cron.id}>
                    <TableCell className="font-semibold text-blue-600">
                      <a href={`/cronjob/${cron.id}`} className="hover:underline">
                        {cron.name}
                      </a>
                    </TableCell>
                    <TableCell>{cron.dailyTime}</TableCell>
                    <TableCell>{cron.interval}</TableCell>
                    <TableCell>{cron.lastRunTime}</TableCell>
                    <TableCell>{cron.lastRunStatus}</TableCell>
                </TableRow>
                ))}
                <Button className='w-full my-3' onClick={() => navigate('/cronjob/create')}>Create Cronjob</Button>
            </TableBody>
        </Table>
        <Card className='w-96 h-96'>
          <CardHeader>
            <CardTitle>Area Chart - Stacked Expanded</CardTitle>
            <CardDescription>
              Showing total visitors for the last 6months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                }}
                stackOffset="expand"
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="other"
                  type="natural"
                  fill="var(--color-other)"
                  fillOpacity={0.1}
                  stroke="var(--color-other)"
                  stackId="a"
                />
                <Area
                  dataKey="mobile"
                  type="natural"
                  fill="var(--color-mobile)"
                  fillOpacity={0.4}
                  stroke="var(--color-mobile)"
                  stackId="a"
                />
                <Area
                  dataKey="desktop"
                  type="natural"
                  fill="var(--color-desktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  January - June 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
    </div>
  );
};

export default ListComponent;
