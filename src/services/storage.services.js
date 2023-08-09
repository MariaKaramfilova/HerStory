import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase.js";
import { updateProfilePic } from "./users.services.js";

export async function uploadProfilePicture(file, currentUser){
  try {
    const fileRef = ref(storage, currentUser.uid + '.png');
    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    await updateProfilePic(photoURL, currentUser)
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return null;
  }
}

export const setFileToStorage = async (file) => {
  const imageRef = ref(storage, `images/${file.name}`);

  await uploadBytes(imageRef, file);
  const url = await getDownloadURL(imageRef);

  return url;
}
