const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const { spawn, fork } = require('child_process');
// removed axios

let mainWindow;
let tray;
let backendProcess;
let isQuitting = false;

function startBackend() {
  if (!app.isPackaged) {
    const backendPath = path.join(__dirname, '../localstream-be');
    backendProcess = spawn('npm', ['run', 'dev'], {
      cwd: backendPath,
      shell: process.env.ComSpec || 'cmd.exe',
    });
  } else {
    // In production, run the compiled backend code directly via Node (embedded in Electron)
    const backendPath = path.join(__dirname, '../localstream-be/dist/index.js');
    backendProcess = fork(backendPath, [], {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: 1 },
      silent: true
    });
  }

  if (backendProcess.stdout) {
    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });
  }

  if (backendProcess.stderr) {
    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });
  }
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });

  // Wait for frontend dev server
  mainWindow.loadURL('http://localhost:4000').catch(() => {
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:4000');
    }, 3000);
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const { nativeImage } = require('electron');
  const iconPath = path.join(__dirname, 'icon.png');
  let icon = nativeImage.createFromPath(iconPath);
  
  if (icon.isEmpty()) {
    icon = nativeImage.createEmpty(); // Fallback if still missing
  } else {
    icon = icon.resize({ width: 16, height: 16 }); // Optimal for Windows Tray
  }

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => mainWindow.show() },
    { label: 'Start Backend', click: startBackend },
    { label: 'Stop Backend', click: stopBackend },
    { label: 'Quit', click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Petek LocalStream');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => mainWindow.show());
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
  createTray();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  stopBackend();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('start-backend', () => startBackend());
ipcMain.on('stop-backend', () => stopBackend());
