import { FileFilter, contextBridge, ipcRenderer } from 'electron';
import { BrowserWindow, dialog } from '@electron/remote';
import * as fs from 'fs';
import * as path from 'path';
import { patchDocument } from 'docx';
import { PatchType, TextRun, PatchDocumentOptions, IPatch } from 'docx';
import { IForm, IVariables } from '../src/ts/formJsonValidation';

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

    function getElementsToPatch(element: IVariables[]): PatchDocumentOptions {
      const patches: { [key: string]: IPatch } = {};
      element.forEach((patch) => {
        patches[patch.name] = {
          type: PatchType.PARAGRAPH,
          children: [new TextRun(patch.value)],
        };
      });

      return { patches, keepOriginalStyles: true };
    }

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

    const elementsToPatch = getElementsToPatch(formData.variables);

    for (const document of formData.paths) {
      await patchDocument(fs.readFileSync(document.path), elementsToPatch).then(
        (doc) => {
          fs.writeFileSync(
            `${folderPath}\\${path.parse(document.path).base}`,
            doc
          ); // catch exception not needed
        }
      );
    }

    fs.writeFileSync(
      `${folderPath}\\${formData.name}_used.json`,
      JSON.stringify(formData)
    ); // catch exception not needed

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
