import type { ChangeEvent } from 'react';
import { getCompressedFileData } from './compressor';
import { AppFormState, TeamInput } from './types';

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

export const validateAppDataAndGetErrorMessages = (appData: AppFormState) => {
  const errors: string[] = [];
  if (!appData.name) {
    errors.push('アプリ名を入力してください。');
  } else if (appData.name.length > 30) {
    errors.push('アプリ名は30字以内で指定してください。');
  }
  if (!appData.url) {
    errors.push('アプリのURLを入力してください。');
  }
  return errors;
};

export const validateTeamDataAndGetErrorMessages = (teamData: TeamInput) => {
  const errors: string[] = [];
  if (!teamData.teamName) {
    errors.push('チーム名を入力してください。');
  } else if (teamData.teamName.length > 30) {
    errors.push('チーム名は30字以内で指定してください。');
  }
  return errors;
};
