import os from 'os';

export function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let fallbackIp = 'localhost';

  for (const name of Object.keys(interfaces)) {
    // Skip known virtual adapters
    if (name.toLowerCase().includes('vbox') || name.toLowerCase().includes('vmware') || name.toLowerCase().includes('tailscale')) {
      continue;
    }

    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prioritize standard local subnets (192.168.x.x or 10.x.x.x)
        if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.')) {
          return iface.address;
        }
        
        // Save the first valid IPv4 as fallback
        if (fallbackIp === 'localhost') {
          fallbackIp = iface.address;
        }
      }
    }
  }
  return fallbackIp;
}
