import { readFileSync, writeFileSync, unlinkSync } from 'fs';

import { get } from 'lodash';
import { set } from 'lodash/fp';

type IntConfigType = Record<string, unknown> | null;

export type ConfigType = {
  set: (keyPath: string, value: unknown) => void;
  get: (keyPath: string) => unknown;
  remove: () => void;
};

export function start({
  configName,
  targetFullPath,
}: Readonly<{
  configName: string;
  targetFullPath: string;
}>): ConfigType {
  let cache: IntConfigType = Object.create(null) as null;
  let loadedData: string | undefined;

  try {
    loadedData = readFileSync(targetFullPath, 'utf8');
    cache = loadedData ? (JSON.parse(loadedData) as IntConfigType) : null;
    console.log(`get: read ${configName}`);

    if (!cache) {
      console.log(`start: ${configName} false data, cache is empty`);
      cache = Object.create(null) as null;
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      throw error;
    }

    if (loadedData) {
      console.log(`start: ${configName} no data, set fresh`);
    } else {
      console.log(
        `start: ${configName} not found or empty, making empty object`
      );
    }
    cache = Object.create(null) as null;
  }

  function newGet(keyPath: string): unknown {
    return get(cache, keyPath);
  }

  function newSet(keyPath: string, value: unknown): void {
    const newCache = set(keyPath, value, cache as Record<string, unknown>);

    // console.log(`set: saving ${configName}`);

    // if (!throwOnFilesystemErrors) {
    //   cachedValue = newCachedValue;
    // }
    const savedData = JSON.stringify(newCache, null, '  ');
    try {
      writeFileSync(targetFullPath, savedData, 'utf8');
      console.log(`set: saved ${configName}`);
      cache = newCache;
    } catch (err: unknown) {
      console.warn(
        `set: failed to save ${configName}; updating in-memory data`
      );
    }
  }

  function remove(): void {
    try {
      unlinkSync(targetFullPath);
      console.log(`remove: deleted ${configName}`);
    } catch (err: unknown) {
      console.warn(
        `remove: got ${String(get(err, 'code'))} when removing ${configName}`
      );
    }
    cache = Object.create(null) as null;
  }

  return {
    set: newSet,
    get: newGet,
    remove,
  };
}
