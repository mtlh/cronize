import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "./ui/select";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState, type ChangeEvent } from "react";
import { LoadingSpinnerPlaygroundButton } from "./ui/loadingspinner";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { LoaderCircle } from "lucide-react";

export default function PlaygroundReqOpt() {
    const [cronRequestType, setCronRequestType] = useState("GET");
    const [cronRequestHeaders, setCronRequestHeaders] = useState<Array<{key: string, value: string}>>(JSON.parse('[]'));
    const [cronRequestBody, setCronRequestBody] = useState("");
    const [loadingResponse, setLoadingResponse] = useState(false);

    const [responseUrl, setresponseUrl] = useState('');
    const [responseStatus, setresponseStatus] = useState('');
    const [responseResponse, setresponseResponse] = useState('');
    const [responseError, setresponseError] = useState('');
    const [didresponseError, setDidresponseError] = useState(false);

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

    function createListItem(url: string, status: string) {
        const ul = document.getElementById('playgroundHistory')!;
        const li = document.createElement('li');
        const div = document.createElement('div');
        div.className = 'grid md:grid-cols-9 grid-cols-1 gap-x-4 gap-y-0 md:gap-y-2 my-4 md:my-0 border-b border-card-foreground border-dashed';
        const spanUrl = document.createElement('span');
        spanUrl.textContent = url;
        spanUrl.className = 'font-mono font-normal text-sm col-span-6';
        const spanStatus = document.createElement('span');
        if (status.startsWith('2')) { spanStatus.className = 'text-green-500'; } else { spanStatus.className = 'text-red-500';}
        spanStatus.textContent = status;
        const spanTime = document.createElement('span');
        spanTime.className = 'italic col-span-2';
        spanTime.textContent = new Date().toLocaleString();
        div.appendChild(spanUrl);
        div.appendChild(spanStatus);
        div.appendChild(spanTime);
        li.appendChild(div);
        if (ul.children.length > 1) {
          ul.insertBefore(li, ul.children[1]);
        } else {
          ul.insertBefore(li, ul.firstChild);
        }
    }

    async function handleFormSubmit() {
        setLoadingResponse(true);
        // @ts-ignore
        const url = document.querySelector("#playgroundUrl")!.value;

        let status = 500;
        if (url) {
            console.log(url);
            try {
                // Make the request
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
                const response = await fetch(url, options);
                status = response.status;
                console.log(response);

                setresponseUrl(url);
                setresponseStatus(`${status}`);
                setresponseResponse(await response.text());

                createListItem(url, `${status}`);

            } catch (error) {
                console.error(error);
                createListItem(url, status.toString());
                // @ts-ignore
                setresponseError(error.message);
                setresponseStatus("500 (error during request)");
            }

            // Save history record (request /api/addHistory)
            fetch('/api/addHistory', {
                method: 'POST',
                body: new URLSearchParams({
                url: url,
                status: status.toString()
                }),
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }
        setLoadingResponse(false);
    }
        
    return (
        <>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="url" className="block mb-1 text-sm font-medium text-card-foreground">
                    URL
                </label>
                <Input
                    id="playgroundUrl"
                    type="text"
                    placeholder="Enter a URL"
                    className="w-full px-3 py-2 rounded-md border border-input text-card-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Label>Request Type</Label>
                <Select defaultValue={cronRequestType} onValueChange={(value) => setCronRequestType(value)}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a request type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                            <SelectItem value="PATCH">PATCH</SelectItem>
                            <SelectItem value="CONNECT">CONNECT</SelectItem>
                            <SelectItem value="HEAD">HEAD</SelectItem>
                            <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
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
                <Button
                    type="button"
                    className="w-20"
                    onClick={() => handleAddFields()}
                    >
                    Add
                </Button>
                <Label>Request Body</Label>
                <Textarea
                    value={cronRequestBody}
                    onChange={(e) => setCronRequestBody(e.target.value)}
                    placeholder="Request Body"
                    className='w-full text-lg p-2 border border-gray-300 rounded-md' />
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="w-full px-4 py-2 mt-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        id="handlePlaygroundSubmit"
                        type="button"
                        onClick={handleFormSubmit}
                    >
                        <p id="playgroundSubmitText">Send Request</p>
                        <LoadingSpinnerPlaygroundButton />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogTitle>Response</DialogTitle>
                    <DialogDescription>
                    Here is the response from your playground request.
                    </DialogDescription>
                    {loadingResponse ?
                        <LoaderCircle className='animate-spin w-20 h-20 text-orange-400 m-auto' />
                        :
                        <>
                            {didresponseError ?
                                <div className='flex flex-col gap-4'>
                                    <p className='flex gap-4'>Error:</p>
                                    <p className='p-4 bg-gray-200 rounded-md border border-gray-300'>{responseError}</p>
                                </div>
                            :
                                <div className='flex flex-col gap-4'>
                                    <div className='flex flex-col'>
                                    <p className='flex'>URL:</p>
                                    <p className='p-2 bg-gray-200 rounded-md border border-gray-300'>{responseUrl}</p>
                                    <p className='flex pt-2'>Status:</p>
                                    <p className='p-2 bg-gray-200 rounded-md border border-gray-300'>{responseStatus}</p>
                                    <p className='flex pt-2'>Response:</p>
                                    <p className='p-2 bg-gray-200 rounded-md border border-gray-300 overflow-x-auto break-words'>{responseResponse}</p>
                                    </div>
                                </div>
                            }
                        </>
                    }
                </DialogContent>
            </Dialog>
        </>
)};