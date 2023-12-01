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

import { FileFilter, contextBridge, ipcRenderer } from 'electron';
import { BrowserWindow, dialog } from '@electron/remote';
import * as fs from 'fs';
import * as path from 'path';
import { patchDocument } from 'docx';
import { PatchType, TextRun, PatchDocumentOptions, IPatch } from 'docx';
// import { IForm, IVariables} from '/src/ts/formJsonValidation';
import { IForm, IVariables } from '../src/ts/formJsonValidation';

// interface IVariables {
//   name: string;
//   value: string;
// }

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
    let notPatchError: Error | boolean = true;

    // async function patchSelectedDocument(
    //   documents: IPath[],
    //   patch_list: PatchDocumentOptions
    // ) {
    //   documents.forEach((document) => {
    //     patchDocument(fs.readFileSync(document.path), patch_list)
    //       .then((doc) => {
    //         fs.writeFileSync(
    //           `${folderPath}\\${path.parse(document.path).base}`,
    //           doc
    //         );
    //       })
    //       .catch((error: Error) => {
    //         console.log('error in patch', error);
    //         notPatchError = error;
    //       });
    //   });
    // }

    function getElementsToPatch(element: IVariables[]): PatchDocumentOptions {
      const patches: { [key: string]: IPatch } = {};
      element.forEach((patch) => {
        patches[patch.name] = {
          type: PatchType.PARAGRAPH,
          children: [new TextRun(patch.value)],
        };
      });
      console.log('got elements to patch.');

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

    console.log('checking folder');

    if (!folderPath) {
      return false;
    }

    console.log('getting elements to patch');

    const elementsToPatch = getElementsToPatch(formData.variables);

    // await patchSelectedDocument(formData.paths, elementsToPatch);

    formData.paths.forEach((document) => {
      // patchSelectedDocument(document.path, elementsToPatch);
      patchDocument(fs.readFileSync(document.path), elementsToPatch)
        .then((doc) => {
          console.log('writing...');

          fs.writeFileSync(
            `${folderPath}\\${path.parse(document.path).base}`,
            doc
          );

          console.log('writed.');
        })
        .catch((error: Error) => {
          console.log('error in patch', error);
          notPatchError = error;
        });
    });

    console.log(notPatchError);

    console.log('writing json...');
    fs.writeFileSync(
      `${folderPath}\\${formData.name}_used.json`,
      JSON.stringify(formData)
    ); // exception not needed
    console.log('writed json.');

    return notPatchError;
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
