import type { Cronjob, CronjobHistory } from '@/db/types';
import { useState, useEffect, type ChangeEvent } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ArrowLeft, Delete, DeleteIcon, LoaderCircle, Save, ShieldCheck, SkipBack, Trash2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { SelectValue, Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectLabel } from './ui/select';
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Table} from './ui/table';

const ListComponent = ({id}: {id: number}) => {
  const { toast } = useToast()

  const [data, setData] = useState<Cronjob>();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(true);
  const [loadingTest, setLoadingTest] = useState(false);

  const [testUrl, setTestUrl] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [testError, setTestError] = useState('');
  const [didTestError, setDidTestError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getCron?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        let result: {cron: Cronjob, history: CronjobHistory[]} = await response.json();
        console.log(result);
        const cronData = result.cron as Cronjob;
        setCronName(cronData?.name);
        setCronUrl(cronData?.url);
        setCronRequestType(cronData?.request_type);
        setCronRequestHeaders(JSON.parse(cronData?.request_headers?.toString() || '[]'));
        setCronRequestBody(cronData?.request_body);
        setCronInterval(cronData?.interval);
        const [datePart, timePart] = cronData?.daily_time!.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        // Create a new Date object in UTC
        const dateObjectUTC = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
        setCronDailyTime(dateObjectUTC);
        setCronLastRunStatus(cronData?.last_run_status);
        setCronLastRunTime(cronData?.last_run_time);
        setHistory(result.history);
        setData(cronData);
        // timeout 200ms
        setTimeout(() => {
          setLoading(false);
          setSaveLoading(false);
          setLoadingTest(false);
        }, 200);
      } catch (err: any) {
        toast({
          title: "Get Cron Failed",
          description: err.message,
        });
      }
    };

    fetchData();
  }, []);

  const [cronName, setCronName] = useState(data?.name);
  const [cronUrl, setCronUrl] = useState(data?.url);
  const [cronRequestType, setCronRequestType] = useState(data?.request_type);
  const [cronRequestHeaders, setCronRequestHeaders] = useState<Array<{key: string, value: string}>>(JSON.parse(data?.request_headers?.toString() || '[]'));
  const [cronRequestBody, setCronRequestBody] = useState(data?.request_body);
  const [cronInterval, setCronInterval] = useState(data?.interval);
  const [cronDailyTime, setCronDailyTime] = useState(new Date(data?.daily_time!));
  const [cronLastRunStatus, setCronLastRunStatus] = useState(data?.last_run_status);
  const [cronLastRunTime, setCronLastRunTime] = useState(data?.last_run_time);

  const [history, setHistory] = useState<CronjobHistory[]>([]);

  function handleUpdateCron() {
    setSaveLoading(true);
    const formdata = new FormData();
    formdata.append('id', data!.id.toString());
    formdata.append('name', cronName!.toString());
    formdata.append('url', cronUrl!.toString());
    formdata.append('request_type', cronRequestType!.toString());
    formdata.append('request_headers', JSON.stringify(cronRequestHeaders!));
    try {
      formdata.append('request_body', cronRequestBody!.toString());
    } catch {
      formdata.append('request_body', '');
    }
    formdata.append('interval', cronInterval!.toString());
    formdata.append('daily_time', new Date(cronDailyTime!).toISOString().slice(0, 19).replace('T', ' '));
    fetch('/api/updateCron', {
      method: 'POST',
      body: formdata,
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.text();
    }).then((data) => {
      toast({
        title: "Update Cron",
        description: "Successfully updated cron.",
      });
      setSaveLoading(false);
    }).catch((error) => {
      console.error('Error:', error);
      toast({
        title: "Update Cron",
        description: "Failed to update cron.",
      });
      setSaveLoading(false);
    });
  }

  function handleDeleteCron() {
    fetch('/api/deleteCron?id=' + data!.id.toString(), {
      method: 'GET',
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.text();
    }).then(() => {
      toast({
        title: "Delete Cron",
        description: "Cron deleted successfully.",
      });
      location.href = '/project/' + data!.project_id;
    }).catch((error) => {
      console.error('Error:', error);
      toast({
        title: "Delete Cron",
        description: "Failed to delete cron.",
      });
    });
  }

  function handleTestCron() {
    setLoadingTest(true);
    const headers = cronRequestHeaders.reduce((acc, curr) => {
      // @ts-ignore
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    const options = {
      method: cronRequestType!.toString().toUpperCase(),
      headers: headers,
    };
    // Only include the body for methods that allow it
    if (options.method !== 'GET' && options.method !== 'HEAD') {
      // @ts-ignore
      options.body = cronRequestBody!;
    }
    fetch(cronUrl!.toString(), options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response;
      })
      .then(async (res) => {
        setDidTestError(false);
        setTestUrl(res.url);
        setTestStatus(res.status.toString());
        setTestResponse(await res.text());
        setTimeout(() => {
          setLoadingTest(false);
        }, 200);
      })
      .catch((error) => {
        setDidTestError(true);
        setTestError(error.message);
        setTimeout(() => {
          setLoadingTest(false);
        }, 200);
      });
  }  

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const values = [...cronRequestHeaders];
    // @ts-ignore
    values[index][event.target.name] = event.target.value;
    setCronRequestHeaders(values);
  };

  const handleAddFields = () => {
    setCronRequestHeaders([...cronRequestHeaders, { key: '', value: '' }]);
  };

  const handleRemoveFields = (index: number) => {
    const values = [...cronRequestHeaders];
    values.splice(index, 1);
    setCronRequestHeaders(values);
  };

  return (
    <>
      {loading ? 
        <div className='flex justify-center m-auto'>
          <LoaderCircle className='animate-spin w-20 h-20 text-orange-400' />
        </div>
        :
        <>
          <div className='max-w-7xl mx-auto min-w-[60%]'>
            <div className='grid grid-cols-3 gap-6 py-2'>
              <a href={'/project/' + data?.project_id} className='text-sm font-thin flex text-left'>
                <ArrowLeft className='w-5 h-5 pr-1' /> Back to Project
              </a>
              <div></div>
              <div className='flex justify-end'>
                <button onClick={handleDeleteCron} className='text-sm font-thin flex'>
                  Delete <Trash2 className='w-5 h-5 pl-1' />
                </button>
              </div>
            </div>
            <Card className="w-full p-4 bg-white shadow-lg rounded-lg">
              <CardContent>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {data?.created_at && (
                    <p className='text-lg font-semibold mt-4 py-2'>
                      Created - {new Date(data?.created_at).toLocaleString()}
                    </p>
                  )}
                  <div className='flex justify-end gap-6'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={handleTestCron} className='mt-4 bg-black hover:bg-black/80 border text-white font-bold py-2 px-4 rounded w-28'><ShieldCheck /> Test</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px]">
                      <DialogTitle>Test Cronjob</DialogTitle>
                      <DialogDescription>
                        Test your cronjob to see if it works. This will send a test request to your cronjob's URL.
                      </DialogDescription>
                      {loadingTest ?
                        <LoaderCircle className='animate-spin w-20 h-20 text-orange-400 m-auto' />
                        :
                        <>
                          {didTestError ?
                            <div className='flex flex-col gap-4'>
                              <p className='flex gap-4'>Error:</p>
                              <p className='p-4 bg-gray-200 rounded-md border border-gray-300'>{testError}</p>
                            </div>
                            :
                            <div className='flex flex-col gap-4'>
                              <div className='flex flex-col gap-4'>
                                <p className='flex gap-4'>URL:</p>
                                <p className='p-4 bg-gray-200 rounded-md border border-gray-300'>{testUrl}</p>
                                <p className='flex gap-4'>Status:</p>
                                <p className='p-4 bg-gray-200 rounded-md border border-gray-300'>{testStatus}</p>
                                <p className='flex gap-4'>Response:</p>
                                <p className='p-4 bg-gray-200 rounded-md border border-gray-300'>{testResponse}</p>
                              </div>
                            </div>
                          }
                        </>
                      }
                    </DialogContent>
                  </Dialog>
                    {saveLoading ?
                      <Button onClick={handleUpdateCron} className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-28' disabled><LoaderCircle className='animate-spin' /></Button>
                      :
                      <Button onClick={handleUpdateCron} className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-28'><Save /> Save</Button>
                    }
                  </div>
                </div>
                <Tabs defaultValue="details" className='py-2'>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details">
                    <div className='grid grid-cols-1 gap-2'>
                      <div className='md:col-span-2'>
                        <Label>Name</Label>
                        <Input
                          value={cronName}
                          onChange={(e) => setCronName(e.target.value)}
                          placeholder="Cron Name"
                          className='w-full text-lg p-2 border border-gray-300 rounded-md' />
                      </div>
                      <div className='md:col-span-2'>
                        <Label>URL</Label>
                        <Input
                          value={cronUrl}
                          onChange={(e) => setCronUrl(e.target.value)}
                          placeholder="Cron URL"
                          className='w-full text-lg p-2 border border-gray-300 rounded-md' />
                      </div>
                      <div className='md:col-span-2'>
                        <Label>Request Type</Label>
                        {cronRequestType != undefined ?
                          <Select defaultValue={cronRequestType} onValueChange={(value) => setCronRequestType(value)}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select a request type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="get">GET</SelectItem>
                                <SelectItem value="post">POST</SelectItem>
                                <SelectItem value="put">PUT</SelectItem>
                                <SelectItem value="delete">DELETE</SelectItem>
                                <SelectItem value="patch">PATCH</SelectItem>
                                <SelectItem value="connect">CONNECT</SelectItem>
                                <SelectItem value="head">HEAD</SelectItem>
                                <SelectItem value="options">OPTIONS</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          :
                          <Select defaultValue="get" onValueChange={(value) => setCronRequestType(value)}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select a request type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="get">GET</SelectItem>
                                <SelectItem value="post">POST</SelectItem>
                                <SelectItem value="put">PUT</SelectItem>
                                <SelectItem value="delete">DELETE</SelectItem>
                                <SelectItem value="patch">PATCH</SelectItem>
                                <SelectItem value="connect">CONNECT</SelectItem>
                                <SelectItem value="head">HEAD</SelectItem>
                                <SelectItem value="options">OPTIONS</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          }
                      </div>
                      <div className='md:col-span-2'>
                        <Label>Request Headers</Label>
                        {cronRequestHeaders.map((input, index) => (
                          <div key={index} className='flex gap-6 py-1'>
                            <Input
                              type="text"
                              name="key"
                              placeholder="Key"
                              value={input.key}
                              onChange={(event) => handleInputChange(index, event)} />
                            <Input
                              type="text"
                              name="value"
                              placeholder="Value"
                              value={input.value}
                              onChange={(event) => handleInputChange(index, event)} />
                            <Button
                              type="button"
                              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                              onClick={() => handleRemoveFields(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <div className='flex'>
                          <Button
                            type="button"
                            onClick={() => handleAddFields()}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                      <div className='md:col-span-2'>
                        <Label>Request Body</Label>
                        <Textarea
                          value={cronRequestBody}
                          onChange={(e) => setCronRequestBody(e.target.value)}
                          placeholder="Request Body"
                          className='w-full text-lg p-2 border border-gray-300 rounded-md' />
                      </div>
                      <div className='md:col-span-2'>
                        <Label>Interval</Label>
                        {cronInterval != undefined ?
                          <Select defaultValue={cronInterval} onValueChange={(value) => setCronInterval(value)}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select an interval" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                              <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="single">One-off</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          :
                          <Select defaultValue="hourly" onValueChange={(value) => setCronRequestType(value)}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select an interval" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="single">One-off</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        }
                      </div>
                      <div className='md:col-span-2'>
                        <Label>Run Time</Label>
                        <input type="datetime-local" 
                          value={cronDailyTime.toISOString().slice(0, 19).replace('T', ' ')} onChange={(e) => setCronDailyTime(new Date(e.target.value))}
                          className='w-full text-lg p-2 border border-gray-300 rounded-md'
                          placeholder="Run time"
                         />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="history">
                    <div>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                <TableHead>Run Time</TableHead>
                                <TableHead >Status</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {history.map((history) => (
                              <TableRow key={history.id}>
                                  <TableCell className="font-semibold">
                                    {new Date(history.ran_time).toLocaleString()}
                                  </TableCell>
                                  <TableCell>{history.status || '-'}</TableCell>
                              </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </>
      }
    </>
  );
};

export default ListComponent;