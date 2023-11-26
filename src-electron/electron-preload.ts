/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import { FileFilter, contextBridge } from 'electron';
import { BrowserWindow, dialog } from '@electron/remote';
import * as fs from 'fs';
import * as path from 'path';
import { patchDocument } from 'docx';

import { PatchType, TextRun, PatchDocumentOptions, IPatch } from 'docx';

interface IVariables {
  name: string;
  value: string;
}

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

  async variablesFilePatcher(variables_in: string, documents_in: string) {
    const variables: IVariables[] = JSON.parse(
      String(variables_in)
    ) as IVariables[];

    const documents: string[] = JSON.parse(documents_in) as string[];

    let folderPath: string = '';

    function patchSelectedDocument(
      document: string,
      patch_list: PatchDocumentOptions
    ) {
      patchDocument(fs.readFileSync(document), patch_list)
        .then((doc) => {
          fs.writeFileSync(`${folderPath}\\${path.parse(document).base}`, doc);
        })
        .catch((error) => {
          console.log('error in patch', error);
        });
    }

    function getElementsToPatch(element: IVariables[]): PatchDocumentOptions {
      const patches: { [key: string]: IPatch } = {};
      element.forEach((patch) => {
        patches[patch.name] = {
          type: PatchType.PARAGRAPH,
          children: [new TextRun(patch.value)],
        };
      });
      return { patches };
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
    const elementsToPatch = getElementsToPatch(variables);

    documents.forEach((document) => {
      patchSelectedDocument(document, elementsToPatch);
    });

    return true;
  },
});
