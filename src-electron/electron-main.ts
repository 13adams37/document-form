import { app, screen, BrowserWindow } from 'electron';
import { initialize, enable } from '@electron/remote/main';
import * as path from 'path';
import * as os from 'os';

// needed in case process is undefined under Linux
const platform: string = process.platform || os.platform();

let mainWindow: BrowserWindow;

initialize();

function createWindow() {
  /**
   * Initial window options
   */
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/saturn.ico'), // tray icon
    width,
    height,
    useContentSize: true,
    frame: false,
    webPreferences: {
      sandbox: false,
      webSecurity: true,
      nodeIntegration: true,
      // contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        __dirname,
        process.env.QUASAR_ELECTRON_PRELOAD as string
      ),
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.maximize();
  });

  enable(mainWindow.webContents);

  void mainWindow.loadURL(process.env.APP_URL!);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      // mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    Object.assign(mainWindow, null);
  });
}

void app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
