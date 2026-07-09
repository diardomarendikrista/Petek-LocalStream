# Petek LocalStream

LocalStream is a lightweight, production-ready LAN video streaming server. It allows you to select a local folder containing videos and stream them directly to any device on your local network (LAN) without complex configurations, logins, or external internet connections.

## Features
- **Zero Configuration**: No database, no login, LAN only.
- **Standalone Portable App**: Packaged as a single `.exe` file that runs its own internal Express server. No Node.js required on the host machine.
- **Dynamic File Watcher**: Automatically scans and updates the video list when new files are added to your folder.
- **Modern Web Interface**: Responsive React/Vite dashboard for seamless viewing on mobile and desktop browsers.
- **HTTP Range Requests**: Efficient video streaming with seek support.

## Development Setup
To run the application in development mode (with hot-reloading for both Frontend and Backend):

1. Install dependencies at the root folder (this will also install FE/BE dependencies):
   ```bash
   npm install
   ```

2. Start the development servers:
   ```bash
   npm run dev
   ```

## Production Build
To package the application into a standalone Windows Executable (`.exe`):

```bash
npm run build
```
This will generate two files in the `dist` folder:
- **`Petek LocalStream 1.0.0.exe`**: The Portable version. You can run this directly from a USB flash drive or any folder.
- **`Petek LocalStream Setup 1.0.0.exe`**: The Installer version.

*Note: The application configuration (`settings.json`) is dynamically saved in the same directory as the executable, ensuring true portability.*

## Architecture
- `localstream-fe`: React frontend dashboard (Vite + Tailwind CSS).
- `localstream-be`: Express API backend and Chokidar file watcher (CommonJS + Dynamic ESM Imports).
- `electron`: Electron application wrapper serving as the Desktop GUI and system tray manager.

## Next Steps
Launch the application, go to the **Settings** page, enter your absolute folder path (e.g., `D:\Movies`), and start streaming!
