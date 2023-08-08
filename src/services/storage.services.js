import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase.js";
import { updateProfile } from "firebase/auth";

export async function uploadProfilePicture(file, currentUser, setLoading){
  const fileRef = ref(storage, currentUser.uid + '.png');
  setLoading(true);
  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  updateProfile(currentUser, {photoURL})
  setLoading(false);
  alert('You have successfully changed your profile picture! Please refresh the page to see your new profile picture!');
}

export const setFileToStorage = async (file) => {
  const imageRef = ref(storage, `images/${file.name}`);

  await uploadBytes(imageRef, file);
  const url = await getDownloadURL(imageRef);

  return url;
}
