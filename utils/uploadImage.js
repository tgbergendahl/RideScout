// utils/uploadImage.js
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const uploadImageAsync = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const storage = getStorage();
  const fileRef = ref(storage, `profileImages/${uuidv4()}`);
  const result = await uploadBytesResumable(fileRef, blob);

  blob.close();

  return await getDownloadURL(result.ref);
};
