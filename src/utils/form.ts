import type { ChangeEvent } from 'react';
import { getCompressedFileData } from './compressor';

export const stateSetter = <T>(state: T, setter: (obj: T) => void) => {
  return (key: string, value: any) => setter({ ...state, [key]: value });
};

export const imageHandler = (e: ChangeEvent<HTMLInputElement>) => {
  const { files } = e.target;
  if (!files) {
    throw new Error('Invalid files');
  }
  return getCompressedFileData(files[0]);
};

export const whiteSpaceExists = (text: string) => /^[\s]+$/.test(text);
