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
        setData(result);
        if (page === 1) {
          setPageLimit(Math.max(result[0].total_history_records/10, 1));
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
      <ul className="min-h-60" id="playgroundHistory">
        {loading && <LoadingSpinnerPlaygroundHistoryContent />}
        {data.map((item) => (
          <li key={item.id} className="grid grid-cols-9 gap-x-4 gap-y-2">
            <span className="font-mono font-normal text-sm col-span-6">{item.url}</span>
            { item.status.startsWith('2') ? <span className="text-green-500">{item.status}</span> : <span className="text-red-500">{item.status}</span> }
            <span className="italic col-span-2">{item.created_at}</span>
          </li>
        ))}
      </ul>
      <div>
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
