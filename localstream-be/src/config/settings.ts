import fs from 'fs-extra';
import path from 'path';

let settingsPath = path.join(__dirname, '../../../settings.json');
if (__dirname.includes('app.asar')) {
  // In production, app.asar is read-only. 
  // We write settings.json to the same folder where the .exe is located.
  settingsPath = path.join(process.cwd(), 'settings.json');
}

export interface Settings {
  folder: string;
  port: number;
  autoStart: boolean;
  startWithWindows: boolean;
  tray: boolean;
  autoScan: boolean;
}

const defaultSettings: Settings = {
  folder: '',
  port: 4000,
  autoStart: true,
  startWithWindows: false,
  tray: true,
  autoScan: true
};

let currentSettings: Settings = { ...defaultSettings };

export async function initializeSettings() {
  if (await fs.pathExists(settingsPath)) {
    const data = await fs.readJson(settingsPath);
    currentSettings = { ...defaultSettings, ...data };
  } else {
    await fs.writeJson(settingsPath, currentSettings, { spaces: 2 });
  }
}

export function getSettings(): Settings {
  return currentSettings;
}

export async function saveSettings(newSettings: Partial<Settings>) {
  currentSettings = { ...currentSettings, ...newSettings };
  await fs.writeJson(settingsPath, currentSettings, { spaces: 2 });
}
