import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageAsync = async (uri) => {
  try {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, blob);

    blob.close();

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
