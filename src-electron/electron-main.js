import { app, screen, BrowserWindow } from "electron";
import { initialize, enable } from "@electron/remote/main";
// import { dialog, ipcMain } from "electron";
// import fs from "fs";
import path from "path";
import os from "os";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow;

// setupTitlebar();
initialize();

function createWindow() {
  /**
   * Initial window options
   */
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    // icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    icon: path.resolve(__dirname, "icons/saturn.ico"), // tray icon
    // width: 1000,
    // height: 600,
    // movable: false,
    // resizable: false,
    // maximizable: false,
    // minimizable: false,
    // useContentSize: true,
    width,
    height,
    // titleBarStyle: "hidden",
    useContentSize: true,
    frame: false,
    webPreferences: {
      sandbox: false,
      webSecurity: true,
      nodeIntegration: true,
      // contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  // ipcMain.handle("dialog:openDirectory", async () => {
  //   const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
  //     properties: ["openDirectory"],
  //   });
  //   if (canceled) {
  //     return;
  //   } else {
  //     return filePaths[0];
  //   }
  // });

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
  });

  enable(mainWindow.webContents);
  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // attachTitlebarToWindow(mainWindow);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
