import { Application } from 'express';
import { getStatus, getNetwork } from '../controllers/statusController';
import { getSettingsController, updateSettings } from '../controllers/settingsController';
import { getVideos, getTree } from '../controllers/videoController';
import { streamVideo } from '../controllers/streamController';

export function setupRoutes(app: Application) {
  app.get('/api/status', getStatus);
  app.get('/api/network', getNetwork);
  app.get('/api/settings', getSettingsController);
  app.post('/api/settings', updateSettings);
  app.get('/api/videos', getVideos);
  app.get('/api/tree', getTree);
  app.get('/stream/:id', streamVideo);
}
