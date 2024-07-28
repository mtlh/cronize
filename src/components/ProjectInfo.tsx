import type { ProjectInfo } from '@/db/types';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoaderCircle, Trash2, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, LabelList, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart"
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { toast, useToast } from './ui/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


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
        
        for (const cron of result?.cronjobs!) {
          // count the number of cronjobs for each request type
          if (requestTypeCounts[cron.request_type] === undefined) {
            requestTypeCounts[cron.request_type] = 1; } else {
            requestTypeCounts[cron.request_type] += 1;
          }
        }
        setChartData([
          { type: "GET", quantity: requestTypeCounts['get'] },
          { type: "POST", quantity: requestTypeCounts['post'] },
          { type: "DELETE", quantity: requestTypeCounts['delete'] },
          { type: "PUT", quantity: requestTypeCounts['put'] },
          { type: "PATCH", quantity: requestTypeCounts['patch'] },
          { type: "HEAD", quantity: requestTypeCounts['head'] },
          { type: "OPTIONS", quantity: requestTypeCounts['options'] },
          { type: "CONNECT", quantity: requestTypeCounts['connect'] },
          { type: "TRACE", quantity: requestTypeCounts['trace'] }
        ]);

        setData(result);
      } catch (err: any) {
        console.error(err);
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

  const requestTypeCounts: Record<string, number> = {get: 0, post: 0, delete: 0, put: 0, patch: 0, head: 0, options: 0, connect: 0, trace: 0};
  const [chartData, setChartData] = useState([
    { type: "GET", quantity: 0 },
    { type: "POST", quantity: 0 },
    { type: "DELETE", quantity: 0 },
    { type: "PUT", quantity: 0 },
    { type: "PATCH", quantity: 0 },
    { type: "HEAD", quantity: 0 },
    { type: "OPTIONS", quantity: 0 },
    { type: "CONNECT", quantity: 0 },
    { type: "TRACE", quantity: 0 }
  ]);

  const chartConfig = {
    quantity: {
      label: "Quantity",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
      <>
        {loading ? 
        <div className='flex justify-center max-w-7xl m-auto'>
          <LoaderCircle className='animate-spin w-20 h-20 text-orange-400' />
        </div>
        :
        <>
        <div className="grid items-center gap-4 max-w-7xl mx-auto">
            <div className='flex justify-between'>
              <div className='grid grid-cols-3 gap-6 py-2 w-full'>
                <h1 className="font-semibold italic text-4xl">{data?.name}</h1>
                <div></div>
                <div className='flex justify-end'>
                  <div className='self-end'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className='text-sm font-thin flex'>
                          Delete <Trash2 className='w-5 h-5 pl-1' />
                        </button>
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
                </div>
              </div>
            </div>
            <p className='text-lg'>{data?.description}</p>
            <Tabs defaultValue="crons">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="crons">Cronjobs</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
              <TabsContent value="crons">
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
              </TabsContent>
              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Request Type Breakdown</CardTitle>
                      <CardDescription>
                        The % of cronjobs that are of each request type.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[300px] w-full"
                    >
                      <RadarChart data={chartData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey="type" />
                        <PolarGrid />
                        <Radar
                          dataKey="quantity"
                          fill="var(--color-chart-4)"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
        </div>
      </>
      }
    </>
  );
};

export default ListComponent;
