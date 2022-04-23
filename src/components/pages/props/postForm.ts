export const nameField = {
  inputProps: {
    id: 'name',
    placeholder: 'アプリ名を入力',
  },
  labelProps: {
    htmlFor: 'name',
    value: 'アプリ名',
  },
};

export const descriptionField = {
  labelProps: {
    htmlFor: 'description',
    value: 'アプリの説明',
  },
  textAreaProps: {
    id: 'description',
    placeholder: 'アプリの説明を入力',
  },
};

export const urlField = {
  inputProps: {
    id: 'url',
    placeholder: 'URLを入力',
  },
  labelProps: {
    htmlFor: 'url',
    value: 'アプリのURL',
  },
};
