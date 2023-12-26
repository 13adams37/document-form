import { IForm, IVariables } from './formJsonValidation';
import { patchDocument } from 'docx';
import { PatchType, TextRun, PatchDocumentOptions, IPatch } from 'docx';
import { Buffer } from 'buffer';

export default async function filePatcher(formData: IForm, files: File[]) {
  interface IPatchedFiles {
    name: string;
    data: Buffer | Uint8Array;
  }
  const patchedFiles: IPatchedFiles[] = [];

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
  }

  return patchedFiles;
}
