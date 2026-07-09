import chokidar from 'chokidar';
import { scanFolder } from '../scanner';

let watcher: any = null;

export const startWatcher = (folderPath: string) => {
  if (!folderPath) return;

  if (watcher) {
    watcher.close();
  }

  watcher = chokidar.watch(folderPath, {
    ignored: [/(^|[\/\\])\../, /node_modules/], // ignore dotfiles and node_modules
    persistent: true,
    ignoreInitial: true
  });

  let debounceTimer: NodeJS.Timeout | null = null;

  const refreshScan = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      console.log('File change detected, rescanning...');
      await scanFolder(folderPath);
    }, 1000); // 1 second debounce
  };

  watcher
    .on('add', refreshScan)
    .on('unlink', refreshScan)
    .on('change', refreshScan);
};
