import { Request, Response } from 'express';
import { getSettings, saveSettings } from '../config/settings';
import { scanFolder } from '../scanner';
import { startWatcher } from '../watcher';

export const getSettingsController = (req: Request, res: Response) => {
  res.json(getSettings());
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const newSettings = req.body;
    await saveSettings(newSettings);
    
    // Auto-scan on save
    if (newSettings.folder) {
      await scanFolder(newSettings.folder);
      if (newSettings.autoScan !== false) {
        startWatcher(newSettings.folder);
      }
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
};
