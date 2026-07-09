import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, X } from 'lucide-react';

export default function Settings() {
  const queryClient = useQueryClient();
  const [folder, setFolder] = useState('');
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [port, setPort] = useState(4000);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => axios.get('/api/settings').then(res => res.data)
  });

  useEffect(() => {
    if (settings) {
      setFolder(settings.folder || '');
      setFolderHistory(settings.folderHistory || []);
      setPort(settings.port || 4000);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (newSettings: any) => axios.post('/api/settings', newSettings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] })
  });

  const save = () => {
    let newHistory = [...folderHistory];
    if (folder.trim() && !newHistory.includes(folder.trim())) {
      newHistory = [folder.trim(), ...newHistory];
      setFolderHistory(newHistory);
    }
    mutation.mutate({ folder: folder.trim(), folderHistory: newHistory, port });
    setShowDropdown(false);
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newHistory = folderHistory.filter(h => h !== item);
    setFolderHistory(newHistory);
    
    // Automatically save so the deletion persists, but don't accidentally save unsaved folder/port typing
    const savedFolder = settings?.folder || '';
    const savedPort = settings?.port || 4000;

    mutation.mutate({ 
      folder: savedFolder === item ? '' : savedFolder, 
      folderHistory: newHistory, 
      port: savedPort
    });
    
    if (folder === item) {
      setFolder('');
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 space-y-4">
        <div ref={dropdownRef} className="relative z-20">
          <label className="block text-gray-400 mb-1">Shared Folder Path</label>
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white pr-20 focus:outline-none focus:border-blue-500"
              placeholder="D:\Movies"
            />
            <div className="absolute right-2 flex items-center">
              {folder && (
                <button 
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setFolder('');
                  }}
                  title="Clear input"
                >
                  <X size={16} />
                </button>
              )}
              {folder && <div className="h-4 w-px bg-gray-600 mx-1"></div>}
              <button 
                className="p-1 text-gray-400 hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDropdown(!showDropdown);
                }}
                title="Show history"
              >
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
          
          {showDropdown && folderHistory.length > 0 && (
            <div className="absolute z-30 w-full mt-1 bg-gray-900 border border-gray-600 rounded shadow-xl max-h-60 overflow-y-auto">
              {folderHistory.map((item) => (
                <div 
                  key={item} 
                  className="flex items-center justify-between p-2 hover:bg-gray-700 cursor-pointer text-sm text-gray-300 transition-colors"
                  onClick={() => {
                    setFolder(item);
                    setShowDropdown(false);
                  }}
                >
                  <span className="truncate flex-1 font-mono">{item}</span>
                  <button 
                    onClick={(e) => removeHistoryItem(e, item)}
                    className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors"
                    title="Remove from history"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-400 mb-1">Port</label>
          <input 
            type="number" 
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <button 
          onClick={save}
          disabled={mutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50 mt-6 transition-colors"
        >
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
        
        {mutation.isSuccess && (
          <p className="text-green-400 text-center text-sm mt-2">Settings saved & folder scanned!</p>
        )}
      </div>
    </div>
  );
}
