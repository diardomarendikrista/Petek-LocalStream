import { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Settings() {
  const queryClient = useQueryClient();
  const [folder, setFolder] = useState('');
  const [port, setPort] = useState(4000);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => axios.get('/api/settings').then(res => res.data)
  });

  useEffect(() => {
    if (settings) {
      setFolder(settings.folder);
      setPort(settings.port);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (newSettings: any) => axios.post('/api/settings', newSettings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] })
  });

  const save = () => {
    mutation.mutate({ folder, port });
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 space-y-4">
        <div>
          <label className="block text-gray-400 mb-1">Shared Folder Path</label>
          <input 
            type="text" 
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
            placeholder="D:\Movies"
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Port</label>
          <input 
            type="number" 
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
          />
        </div>

        <button 
          onClick={save}
          disabled={mutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
        >
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
        {mutation.isSuccess && (
          <p className="text-green-400 text-center text-sm">Settings saved & folder scanned!</p>
        )}
      </div>
    </div>
  );
}
