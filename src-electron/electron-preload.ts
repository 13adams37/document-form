import { FileFilter, contextBridge, ipcRenderer } from 'electron';
import { BrowserWindow, dialog } from '@electron/remote';
import { IForm, IPath } from '../src/ts/formJsonValidation';
import filePatcher from 'src/ts/filePatcher';
import * as fs from 'fs';

function getFilePath(fileName: string, filters: FileFilter[]) {
  return dialog.showSaveDialog(null!, {
    title: 'Сохранить файл',
    defaultPath: fileName,
    buttonLabel: 'Сохранить',
    filters: filters,
  });
}

contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize() {
    BrowserWindow.getFocusedWindow()?.minimize();
  },

  toggleMaximize() {
    const win: Electron.BrowserWindow =
      BrowserWindow.getFocusedWindow() as Electron.BrowserWindow;

    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  },

  close() {
    BrowserWindow.getFocusedWindow()?.close();
  },

  async saveFile(
    dataToSave: string | NodeJS.ArrayBufferView,
    fileName: string
  ) {
    const { filePath } = await getFilePath(fileName, [
      { name: 'json', extensions: ['json'] },
    ]);
    try {
      fs.writeFileSync(filePath!, dataToSave);
      return true;
    } catch (error) {
      return false;
    }
  },

  async variablesFilePatcher(formData_in: string) {
    const formData: IForm = JSON.parse(formData_in) as IForm;

    let folderPath: string = '';

    await dialog
      .showOpenDialog(null!, {
        properties: ['openFile', 'openDirectory'],
      })
      .then((result) => {
        folderPath = result.filePaths[0];
      })
      .catch((err) => {
        console.log('error in openDialog', err);
      });

    if (!folderPath) {
      return false;
    }

    function getFilesFromFs(fileList: IPath[]) {
      const outputFiles: File[] = [];
      for (const file of fileList) {
        outputFiles.push(new File([fs.readFileSync(file.path)], file.name));
      }
      return outputFiles;
    }

    const patchedTemplates = filePatcher(
      formData,
      getFilesFromFs(formData.paths)
    );

    for (const item of await patchedTemplates) {
      fs.writeFileSync(`${folderPath}\\${item.name}`, item.data);
    }

    fs.writeFileSync(
      `${folderPath}\\${formData.name}_used.json`,
      JSON.stringify(formData)
    );

    return true;
  },

  getThemeSetting() {
    return ipcRenderer.invoke('getColorTheme');
  },

  setThemeSetting(theme: string) {
    ipcRenderer.invoke('setColorTheme', theme).catch((err) => {
      console.log(err);
    });
  },
});
