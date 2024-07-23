import type { Cronjob } from '@/db/types';
import { useState, useEffect } from 'react';

const ListComponent = ({id}: {id: number}) => {
  const [data, setData] = useState<Cronjob>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
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

  return (
    <div className="grid items-center gap-4">
        <h1 className="font-semibold italic text-4xl">{data?.name}</h1>
        <a className='text-lg text-blue-500 underline hover:text-blue-700' href={data?.url}>{data?.url}</a>
        { data?.created_at &&
            <p className='text-lg'>Created - {new Date(data?.created_at!).toLocaleString()}</p>
        }
        <h2>Last Run</h2>
        { data?.last_run_time ?
            <p className='text-lg'>Last Run - {new Date(data?.last_run_time!).toLocaleString()}</p>
            :
            <p className='text-lg'>No runs yet.</p>
        }
        <h2>Next Run</h2>
        { data?.daily_time &&
            <p className='text-lg'>Next Run - {new Date(data?.daily_time!).toLocaleString()}</p>
        }
        <h2>History</h2>
    </div>
  );
};

export default ListComponent;
