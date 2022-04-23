import Compressor from 'compressorjs';

export const getCompressedFileData = async (file) => {
  const result = await compressFile(file);
  const src = await getFileSrc(result);
  return { file: result, src };
};

const compressFile = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.7,
      success: resolve,
      error: reject,
      maxWidth: 200,
      maxHeight: 200,
      mimeType: 'image/jpeg',
    });
  });
};

const getFileSrc = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (err) => reject(err);
    fileReader.readAsDataURL(file);
  });
};

export const headerProps = {
  links: [{ name: 'アカウント' }, { name: '' }],
};
