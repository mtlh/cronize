import type { Cronjob } from '@/db/types';
import { useState, useEffect, type ChangeEvent } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Delete, DeleteIcon, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { SelectValue, Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectLabel } from './ui/select';

const ListComponent = ({id}: {id: number}) => {
  const [data, setData] = useState<Cronjob>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/getCron?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result: Cronjob = await response.json();
        console.log(result);
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
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

  useEffect(() => {
    setCronName(data?.name);
    setCronUrl(data?.url);
    setCronRequestType(data?.request_type);
    setCronRequestHeaders(JSON.parse(data?.request_headers?.toString() || '[]'));
    setCronRequestBody(data?.request_body);
    setCronInterval(data?.interval);
    setCronDailyTime(data?.daily_time);
    setCronLastRunStatus(data?.last_run_status);
    setCronLastRunTime(data?.last_run_time);
  }, [data]);

  function handleUpdateCron() {
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
      setError("Updated Cron.");
    }).catch((error) => {
      console.error('Error:', error);
      setError("Failed to update Cron.");
    });
  }

  function handleDeleteCron() {
    const formdata = new FormData();
    formdata.append('id', data!.id.toString());
    fetch('/api/deleteCron', {
      method: 'POST',
      body: formdata,
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    }).then((data) => {
      console.log(data);
      setError(data);
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  function handleTestCron() {
    console.log('test cron');
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
    <div className="grid items-center gap-4">
        <Card className="w-full p-4 bg-white shadow-lg rounded-lg">
          <CardContent>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {data?.created_at && (
                <p className='text-lg font-semibold'>
                  Created - {new Date(data?.created_at).toLocaleString()}
                </p>
              )}
              <div className='md:col-span-2'>
                <Label>Name</Label>
                <Input
                  value={cronName}
                  onChange={(e) => setCronName(e.target.value)}
                  placeholder="Cron Name"
                  className='w-full text-2xl p-2 border border-gray-300 rounded-md'
                />
              </div>
              <div className='md:col-span-2'>
                <Label>URL</Label>
                <Input
                  value={cronUrl}
                  onChange={(e) => setCronUrl(e.target.value)}
                  placeholder="Cron URL"
                  className='w-full text-lg p-2 border border-gray-300 rounded-md'
                />
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
                  <div key={index} className='flex gap-x-6'>
                    <Input
                      type="text"
                      name="key"
                      placeholder="Key"
                      value={input.key}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                    <Input
                      type="text"
                      name="value"
                      placeholder="Value"
                      value={input.value}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                    <Button
                      type="button"
                      className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                      onClick={() => handleRemoveFields(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div>
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
                  className='w-full text-lg p-2 border border-gray-300 rounded-md'
                />
              </div>
              <div className='md:col-span-2'>
                <Label>Interval</Label>
                <Input
                  value={cronInterval}
                  onChange={(e) => setCronInterval(e.target.value)}
                  placeholder="Interval"
                  className='w-full text-lg p-2 border border-gray-300 rounded-md'
                />
              </div>
              <div className='md:col-span-2'>
                <Label>Daily Time</Label>
                <Input
                  value={cronDailyTime}
                  onChange={(e) => setCronDailyTime(e.target.value)}
                  placeholder="Daily Time"
                  className='w-full text-lg p-2 border border-gray-300 rounded-md'
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className='flex justify-end gap-6'>
          <Button onClick={handleTestCron} className='mt-4 bg-black hover:bg-black/80 border text-white font-bold py-2 px-4 rounded'><ShieldCheck /> Test</Button>
          <Button onClick={handleUpdateCron} className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'><Save /> Save</Button>
          <Button onClick={handleDeleteCron} className='mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'><Trash2 /> Delete</Button>
        </div>
        <p>{error}</p>
    </div>
  );
};

export default ListComponent;