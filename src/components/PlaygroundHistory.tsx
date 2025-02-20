import type { PlaygroundHistoryList } from '@/db/types';
import { useState, useEffect } from 'react';
import { LoadingSpinnerPlaygroundHistoryContent } from './ui/loadingspinner';

const ListComponent = () => {
  const [data, setData] = useState<PlaygroundHistoryList[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageLimit, setPageLimit] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setData([]);
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/getHistory?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        console.log(result);
        if (result.length > 0) {
          setData(result);
        }
        if (result.length > 0) {
          setPageLimit(Math.max(Math.ceil(result[0].total_history_records/10), 1));
        } else {
          setPageLimit(1);
        }
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [page]);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <ul className="min-h-60 overflow-x-auto" id="playgroundHistory">
        {loading ?
          <LoadingSpinnerPlaygroundHistoryContent />
          :
          <li className="grid md:grid-cols-9 grid-cols-1 gap-x-4 gap-y-2">
            <span className="font-mono font-normal text-sm col-span-6">URL</span>
            <span className="font-mono font-normal">Status</span>
            <span className="font-mono font-normal">Time (UTC)</span>
          </li>
        }
        {data.map((item) => (
          <li key={item.id} className="grid md:grid-cols-9 grid-cols-1 gap-x-4 gap-y-0 md:gap-y-2 my-4 md:my-0">
            <span className="font-mono font-normal text-sm col-span-6">{item.url}</span>
            { item.status.startsWith('2') ? <span className="text-green-500">{item.status}</span> : <span className="text-red-500">{item.status}</span> }
            <span className="italic col-span-2">{item.created_at}</span>
          </li>
        ))}
      </ul>
      <div className='pt-2'>
        <button onClick={handlePreviousPage} disabled={page === 1} className='p-2 mr-2 my-2 bg-black text-white rounded-md hover:bg-black/90 disabled:bg-black/50'>
          Back
        </button>
        <span>Page {page} / {pageLimit}</span>
        <button onClick={handleNextPage} disabled={page >= pageLimit} className='p-2 ml-2 my-2 bg-black text-white rounded-md hover:bg-black/90 disabled:bg-black/50'>
          Next
        </button>
      </div>
    </div>
  );
};

export default ListComponent;
