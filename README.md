# LocalStream

LocalStream is a lightweight LAN video streaming server.

## Features
- Zero configuration, no login, LAN only.
- Simple Desktop App wrapper using Electron.
- Express API backend serving videos using HTTP Range Requests.
- Modern React/Vite Dashboard.

## Setup
1. Install dependencies at the root folder:
   ```bash
   npm install
   ```

2. Run the application:
   ```bash
   npm run dev
   ```

## Structure
- `localstream-fe`: React frontend dashboard.
- `localstream-be`: Express API backend and file watcher.
- `electron`: Electron application wrapper.

## Next Steps
Configure the folder in the Settings page of the app to start streaming!
