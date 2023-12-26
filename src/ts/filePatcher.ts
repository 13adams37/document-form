import { IForm, IVariables } from './formJsonValidation';
import { patchDocument } from 'docx';
import { PatchType, TextRun, PatchDocumentOptions, IPatch } from 'docx';
import { Buffer } from 'buffer';

export default async function filePatcher(formData: IForm, files: File[]) {
  // get formData as IForm, files: File[]
  console.log('patcher', formData, files);
  const patchedFiles: object[] = [];

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

  const elementsToPatch = getElementsToPatch(formData.variables);

  const patchTheDocument = async (
    data: Buffer | Blob,
    elementsToPatch: PatchDocumentOptions
  ) => await patchDocument(data, elementsToPatch);

  for (const file of files) {
    let patchedDocxTemplate = await patchTheDocument(file, elementsToPatch);
    for (let i = 0; i < 3; i++) {
      patchedDocxTemplate = await patchTheDocument(
        Buffer.from(patchedDocxTemplate),
        elementsToPatch
      );
    }
    patchedFiles.push({ name: file.name, data: patchedDocxTemplate });
    // fs.writeFileSync(
    //   `${folderPath}\\${path.parse(document.path).base}`,
    //   patchedDocxTemplate
    // );
  }

  // fs.writeFileSync(
  //   `${folderPath}\\${formData.name}_used.json`,
  //   JSON.stringify(formData)
  // ); // catch exception not needed

  // return true;

  return patchedFiles;
}
