import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import type { ProfileData } from "@/db/types";
import { useEffect, useState } from "react";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "./ui/table";
import { LogOut } from "lucide-react";

export default function ProfileMain({ username }: {username: string}) {

    const [profile, setProfile] = useState<ProfileData>(
        {
            cronjobs: null,
        }
    );

    useEffect(() => {
        const fetchProfile = async () => {
            const fetchData = await fetch('/api/getProfile');
            if (fetchData.ok) {
                const profileData = await fetchData.json();
                setProfile(profileData);
            }
        };
        fetchProfile();
        console.log(profile);
    }, []);

    return (
        <>
        <div className="grid grid-cols-1 items-center gap-4 max-w-7xl mx-auto min-w-[60%]">
            <h1 className="text-3xl font-bold text-left w-full min-w-60">{username}'s Profile</h1>
            <div className='grid grid-cols-1 gap-6 py-2 w-full md:grid-cols-2'>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Cronjobs</CardTitle>
                        <CardDescription>
                            The total number of cronjobs you have active.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 m-auto">
                        <div className="flex flex-col gap-4 m-auto">
                            <span className="flex items-center gap-4 text-4xl m-auto">
                                {profile.cronjobs ?
                                    <>
                                        {profile.cronjobs.length}
                                    </>
                                    :
                                    <>
                                        0
                                    </>
                                }
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="">
                    <CardHeader>
                        <CardTitle>Projects</CardTitle>
                        <CardDescription>
                            The total number of projects you have active.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 m-auto">
                        <div className="flex flex-col gap-4 m-auto">
                            <span className="flex items-center gap-4 text-4xl m-auto">
                                {profile.cronjobs &&
                                    <>
                                        {new Set(profile.cronjobs.map(item => item.project_id)).size}
                                    </>
                                }
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <h2 className="text-lg font-medium text-left w-full min-w-60 col-span-2 underline">Recent Runs</h2>
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cronjob Name</TableHead>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Run Time (UTC)</TableHead>
                            <TableHead >Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { profile.cronjobs && 
                            <>
                                {profile.cronjobs.map((cron, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-semibold">
                                            {cron.name}
                                        </TableCell>
                                        <TableCell className="font-normal">
                                            {cron.project_name}
                                        </TableCell>
                                        <TableCell className="font-base">
                                            {new Date(cron.last_run_time).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="font-base">
                                            {cron.last_run_status || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="grid justify-items-stretch">
                <a
                  href="/api/logout"
                  className="justify-self-end flex items-center gap-3 rounded-lg px-3 py-2 bg-red-500 text-white hover:bg-red-400 font-medium transition-all hover:text-primary hover:bg-muted w-32"
                >
                  <LogOut className="h-6 w-6" />
                  Logout
                </a>    
            </div>
        </div>
    </>
  );
};