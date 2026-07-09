import express from 'express';
import cors from 'cors';
import { setupRoutes } from './routes';
import { initializeSettings } from './config/settings';
import { startWatcher } from './watcher';
import { getLocalIP } from './network';

const app = express();
app.use(cors());
app.use(express.json());

setupRoutes(app);

// Serve frontend if dist exists (for production)
import path from 'path';
import fs from 'fs';
const feDistPath = path.join(__dirname, '../../localstream-fe/dist');
if (fs.existsSync(feDistPath)) {
  app.use(express.static(feDistPath));
  // Fallback for React Router
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/stream')) {
      res.sendFile(path.join(feDistPath, 'index.html'));
    } else {
      next();
    }
  });
}

async function startServer() {
  await initializeSettings();
  const settings = require('./config/settings').getSettings();
  
  if (settings.autoScan) {
    startWatcher(settings.folder);
  }

  const port = settings.port || 3000;
  app.listen(port, () => {
    console.log(`LocalStream server running on http://${getLocalIP()}:${port}`);
  });
}

startServer();
