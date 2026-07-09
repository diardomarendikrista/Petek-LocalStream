import { Request, Response } from 'express';
import { getSettings } from '../config/settings';
import { getLocalIP } from '../network';

export const getStatus = (req: Request, res: Response) => {
  const settings = getSettings();
  res.json({
    running: true,
    folder: settings.folder,
    lanAddress: `http://${getLocalIP()}:${settings.port}`,
    port: settings.port,
    clients: 0 // Placeholder for MVP
  });
};

export const getNetwork = (req: Request, res: Response) => {
  res.json({
    ip: getLocalIP(),
    port: getSettings().port
  });
};
