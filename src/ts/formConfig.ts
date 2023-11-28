import { join } from 'path';
import { app } from 'electron';
import { start } from './configStart';

const userData = app.getPath('userData');
const targetFullPath = join(userData, 'form.json');

export const formConfig = start({
  configName: 'form',
  targetFullPath,
});

export const get = formConfig.get.bind(formConfig);
export const remove = formConfig.remove.bind(formConfig);
export const set = formConfig.set.bind(formConfig);
