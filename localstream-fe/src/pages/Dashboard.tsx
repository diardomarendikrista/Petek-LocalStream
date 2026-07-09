import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Dashboard() {
  const { data: status } = useQuery({
    queryKey: ['status'],
    queryFn: () => axios.get('/api/status').then(res => res.data)
  });

  const { data: videos } = useQuery({
    queryKey: ['videos'],
    queryFn: () => axios.get('/api/videos').then(res => res.data)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-gray-400 mb-2">Status</h2>
          <div className="text-2xl font-semibold flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${status?.running ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            {status?.running ? 'Running' : 'Stopped'}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-gray-400 mb-2">Folder</h2>
          <div className="text-lg font-mono truncate">{status?.folder || 'Not selected'}</div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-gray-400 mb-2">LAN Address</h2>
          <div className="text-lg font-mono text-blue-400">
            <a href={status?.lanAddress} target="_blank" rel="noreferrer">{status?.lanAddress}</a>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-gray-400 mb-2">Videos</h2>
          <div className="text-2xl font-semibold">{videos?.length || 0}</div>
        </div>
      </div>
    </div>
  );
}
