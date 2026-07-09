import { Request, Response } from 'express';
import { getSettings, saveSettings } from '../config/settings';

export const getSettingsController = (req: Request, res: Response) => {
  res.json(getSettings());
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    await saveSettings(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
};
