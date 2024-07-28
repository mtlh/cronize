import type { ProjectInfo } from '@/db/types';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoaderCircle, Trash2, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { toast, useToast } from './ui/use-toast';

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
  const { toast } = useToast()
  const [data, setData] = useState<ProjectInfo>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState('weekly');
  const [selectedRequestType, setSelectedRequestType] = useState('get');

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const response = await fetch(`/api/getProjectInfo?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result: ProjectInfo = await response.json();
        console.log(result);
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  async function handleCreateCronjob(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log(selectedInterval, data?.id, document.getElementById('url')?.value, document.getElementById('name')?.value, document.getElementById('interval')?.value, document.getElementById('daily_time_date')?.value, document.getElementById('daily_time_time')?.value)
    const formData = new FormData();
    // @ts-ignore
    formData.append('url', document.getElementById('url')?.value.toString());
    // @ts-ignore
    formData.append('project_id', data?.id.toString());
    // @ts-ignore
    formData.append('name', document.getElementById('name')?.value.toString());
    formData.append('interval', selectedInterval);
    formData.append('request_type', selectedRequestType);
    // @ts-ignore
    formData.append('daily_time', document.getElementById('daily_time_date')?.value.toString() + ' ' + document.getElementById('daily_time_time')?.value.toString());
    const request = await fetch('/api/addCron', {
      method: 'POST',
      body: formData,
    })
    if (request.status === 200) {
      alert('Cronjob created successfully!');
      window.location.reload();
    } else {
      alert('Failed to create cronjob');
    }
  }

  function handleDeleteProject() {
    fetch('/api/deleteProject?id=' + data!.id.toString(), {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.text();
    }).then(() => {
      toast({
        title: "Delete Project",
        description: "Project deleted successfully.",
      });
      location.href = '/profile';
    }).catch((error) => {
      console.error('Error:', error);
      toast({
        title: "Delete Project",
        description: "Failed to delete Project.",
      });
    });
  }

  return (
      <>
        {loading ? 
        <div className='flex justify-center max-w-7xl m-auto'>
          <LoaderCircle className='animate-spin w-20 h-20 text-orange-400' />
        </div>
        :
        <>
        <div className="grid items-center gap-4 max-w-7xl m-auto">
            <div className='flex justify-between'>
              <h1 className="font-semibold italic text-4xl">{data?.name}</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className=' bg-red-500 border-1 hover:bg-red-300'><Trash2 className='w-6 h-6' /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[300px]">
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" className='w-full' onClick={handleDeleteProject}>Yes</Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <p className='text-lg'>{data?.description}</p>
            <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Cronjob Name</TableHead>
                      <TableHead>Start/Run Time</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead>Last Run Time</TableHead>
                      <TableHead >Last Run Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.cronjobs.map((cron) => (
                    <TableRow key={cron.id}>
                        <TableCell className="font-semibold text-blue-600">
                          <a href={`/cronjob/${cron.id}`} className="hover:underline">
                            {cron.name}
                          </a>
                        </TableCell>
                        <TableCell>{cron.daily_time}</TableCell>
                        <TableCell>{cron.interval}</TableCell>
                        <TableCell>{cron.last_run_time || '-'}</TableCell>
                        <TableCell>{cron.last_run_status || '-'}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className='w-full'>Create Cronjob</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <form className="grid gap-4 py-4" onSubmit={handleCreateCronjob}>
                  <DialogHeader>
                    <DialogTitle>Create Cronjob</DialogTitle>
                    <DialogDescription>
                      Create a new cronjob for your project - {data?.name}. All these fields are required and can be updated at any time. You can also update the request headers, and body once it is created.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="name" className="text-right w-32">
                        Name
                      </Label>
                      <Input
                        id="name"
                        defaultValue="Cronjob"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="url" className="text-right w-32">
                        Request URL
                      </Label>
                      <Input
                        id="url"
                        defaultValue="https://cronize.mtlh.dev/api/hello"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="request_type" className="text-right w-32">
                        Request Method
                      </Label>
                      <RadioGroup defaultValue={selectedRequestType} id="request_type" onValueChange={(value) => setSelectedRequestType(value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="get" id="get" />
                          <Label htmlFor="get">GET</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="post" id="post" />
                          <Label htmlFor="post">POST</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="delete" id="delete" />
                          <Label htmlFor="delete">DELETE</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="interval" className="text-right w-32">
                        Interval
                      </Label>
                      <RadioGroup defaultValue={selectedInterval} id="interval" onValueChange={(value) => setSelectedInterval(value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <Label htmlFor="weekly">Weekly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="daily" id="daily" />
                          <Label htmlFor="daily">Daily</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hourly" id="hourly" />
                          <Label htmlFor="hourly">Hourly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single">One-off</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="daily_time" className="text-right w-32">
                        Starting/Run Time
                      </Label>
                      <input aria-label="Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} id='daily_time_date' className="w-full rounded-md border-0 bg-transparent py-2 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-none" />
                      <input
                          aria-label="Time"
                          type="time"
                          defaultValue={new Date().toLocaleTimeString('en-UK', { hour12: false })}
                          id='daily_time_time'
                          className="w-full rounded-md border-0 bg-transparent py-2 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-none"
                        />                
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
      </>
      }
    </>
  );
};

export default ListComponent;
