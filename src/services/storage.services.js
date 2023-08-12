import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase.js";

export const setFileToStorage = async (file) => {
  const imageRef = ref(storage, `images/${file.name}`);

  await uploadBytes(imageRef, file);
  const url = await getDownloadURL(imageRef);

  return url;
}
