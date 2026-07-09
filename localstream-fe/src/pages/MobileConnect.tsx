import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Wifi, QrCode } from 'lucide-react';

export default function MobileConnect() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['status'],
    queryFn: () => axios.get('/api/status').then(res => res.data)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center">
        <Smartphone className="mr-3" size={32} />
        Connect Mobile Device
      </h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col md:flex-row items-center gap-12">
        
        <div className="flex-shrink-0 bg-white p-4 rounded-xl">
          {isLoading ? (
            <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Loading QR...</span>
            </div>
          ) : (
            <QRCodeSVG 
              value={status?.lanAddress || 'http://localhost'} 
              size={256} 
              level="H" 
              includeMargin={false} 
            />
          )}
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2 flex items-center text-blue-400">
              <QrCode className="mr-2" size={24} />
              Scan to Watch
            </h2>
            <p className="text-gray-300 text-lg">
              Open your phone's camera and scan this QR code to instantly access the LocalStream Web UI on your mobile device.
            </p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-300 mb-1 flex items-center">
              <Wifi className="mr-2" size={18} />
              Network Requirements
            </h3>
            <p className="text-sm text-gray-400">
              Ensure your mobile device is connected to the same WiFi network as this computer.
            </p>
          </div>

          <div>
            <span className="text-sm text-gray-400">Direct URL:</span>
            <div className="font-mono bg-gray-900 px-4 py-2 rounded-lg mt-1 text-green-400 text-lg break-all">
              {status?.lanAddress}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
