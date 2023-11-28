import { app, screen, BrowserWindow, ipcMain } from 'electron';
import { initialize, enable } from '@electron/remote/main';
import * as path from 'path';
import * as os from 'os';
import * as formConfig from '../src/ts/formConfig';

// needed in case process is undefined under Linux
const platform: string = process.platform || os.platform();

let mainWindow: BrowserWindow | null;

function getColorTheme(): string {
  const themeColor = formConfig.get('colorTheme');

  if (!themeColor) {
    formConfig.set('colorTheme', 'white');
  }

  if (themeColor === 'dark') {
    return '#1e1e1e';
  }

  return '#e2e2e2'; // default
}

function setColorTheme(theme: string) {
  if (['white', 'dark'].includes(theme)) {
    formConfig.set('colorTheme', theme);
  } else {
    formConfig.set('colorTheme', 'white');
  }
  mainWindow?.setBackgroundColor(getColorTheme());
}

initialize();

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/saturn.ico'), // tray icon
    width,
    height,
    useContentSize: true,
    frame: false,
    backgroundColor: getColorTheme(),
    webPreferences: {
      sandbox: false,
      webSecurity: true,
      nodeIntegration: true,
      // contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD!),
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
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
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

ipcMain.handle('getColorTheme', () => {
  return formConfig.get('colorTheme');
});

ipcMain.handle('setColorTheme', (event, args: string) => {
  setColorTheme(args);
});
