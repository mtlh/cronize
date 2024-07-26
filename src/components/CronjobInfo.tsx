import type { Cronjob } from '@/db/types';
import { useState, useEffect, type ChangeEvent } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Delete, DeleteIcon, LoaderCircle, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { SelectValue, Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectLabel } from './ui/select';
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const ListComponent = ({id}: {id: number}) => {
  const { toast } = useToast()

  const [data, setData] = useState<Cronjob>();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(true);
  const [loadingTest, setLoadingTest] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getCron?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result: Cronjob = await response.json();
        console.log(result);
        setCronName(result?.name);
        setCronUrl(result?.url);
        setCronRequestType(result?.request_type);
        setCronRequestHeaders(JSON.parse(result?.request_headers?.toString() || '[]'));
        setCronRequestBody(result?.request_body);
        setCronInterval(result?.interval);
        setCronDailyTime(result?.daily_time);
        setCronLastRunStatus(result?.last_run_status);
        setCronLastRunTime(result?.last_run_time);
        setData(result);
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
  const [cronDailyTime, setCronDailyTime] = useState(data?.daily_time);
  const [cronLastRunStatus, setCronLastRunStatus] = useState(data?.last_run_status);
  const [cronLastRunTime, setCronLastRunTime] = useState(data?.last_run_time);

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
    formdata.append('daily_time', cronDailyTime!.toString());
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
    fetch(cronUrl!.toString(), {
      method: cronRequestType!.toString().toUpperCase(),
      headers: cronRequestHeaders.reduce((acc, curr) => {
        // @ts-ignore
        acc[curr.key] = curr.value;
        return acc;
      }, {}),
      body: cronRequestBody!,
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.text();
    }).then(() => {
      toast({
        title: "Test Cron",
        description: "Cron tested successfully.",
      });
      setLoadingTest(false);
    }).catch((error) => {
      console.error('Error:', error);
      toast({
        title: "Test Cron",
        description: "Failed to test cron.",
      });
      setLoadingTest(false);
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
          <Card className="w-full p-4 bg-white shadow-lg rounded-lg max-w-6xl m-auto">
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
                    <Button onClick={handleTestCron} className='mt-4 bg-black hover:bg-black/80 border text-white font-bold py-2 px-4 rounded'><ShieldCheck /> Test</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogTitle>Test Cronjob</DialogTitle>
                    <DialogDescription>
                      Test your cronjob to see if it works. This will send a test request to your cronjob's URL.
                    </DialogDescription>
                    {loadingTest ?
                      <LoaderCircle className='animate-spin w-20 h-20 text-orange-400 m-auto' />
                      :
                      <p>Test</p>
                    }
                  </DialogContent>
                </Dialog>
                  {saveLoading ?
                    <Button onClick={handleUpdateCron} className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled><LoaderCircle className='animate-spin' /></Button>
                    :
                    <Button onClick={handleUpdateCron} className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'><Save /> Save</Button>
                  }
                  <Button onClick={handleDeleteCron} className='mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'><Trash2 /> Delete</Button>
                </div>
                <div className='md:col-span-2'>
                  <Label>Name</Label>
                  <Input
                    value={cronName}
                    onChange={(e) => setCronName(e.target.value)}
                    placeholder="Cron Name"
                    className='w-full text-2xl p-2 border border-gray-300 rounded-md' />
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
                    </Select>}
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
                  <div className='flex py-4'>
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
                  <Input
                    value={cronInterval}
                    onChange={(e) => setCronInterval(e.target.value)}
                    placeholder="Interval"
                    className='w-full text-lg p-2 border border-gray-300 rounded-md' />
                </div>
                <div className='md:col-span-2'>
                  <Label>Daily Time</Label>
                  <Input
                    value={cronDailyTime}
                    onChange={(e) => setCronDailyTime(e.target.value)}
                    placeholder="Daily Time"
                    className='w-full text-lg p-2 border border-gray-300 rounded-md' />
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      }
    </>
  );
};

export default ListComponent;