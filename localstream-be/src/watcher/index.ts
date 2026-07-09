import { scanFolder } from '../scanner';

let watcher: any = null;

export const startWatcher = async (folderPath: string) => {
  if (!folderPath) return;

  if (watcher) {
    watcher.close();
  }

  // Use dynamic import to load ESM chokidar 5.x inside CommonJS backend
  const chokidar = (await import('chokidar')).default;

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
