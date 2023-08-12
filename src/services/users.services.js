import { get, set, ref, query, orderByChild, equalTo, update } from "firebase/database";
import { auth, database } from "../config/firebase";
import { setFileToStorage } from "./storage.services.js";

export const fromUsersDocument = snapshot => {
  const usersDocument = snapshot.val();

  return Object.keys(usersDocument).map(key => {
    const post = usersDocument[key];

    return {
      ...post,
      username: key,
      createdOn: new Date(post.createdOn),
    };
  });
}

export const getUserByUsername = (username) => {
  return get(ref(database, `users/${username}`));
}

export const createUserByUsername = (firstName, lastName, uid, email, username, profilePictureURL) => {
  return set(ref(database, `users/${username}`), {
    firstName,
    lastName,
    uid,
    username,
    profilePictureURL,
    email,
    role: 'user',
    createdOn: Date.now(),
  })
}

export const getUserData = (uid) => {
  return get(ref(database, 'users'), orderByChild('uid'), equalTo(uid))
}

export const getAllUsers = () => {
  return get(ref(database, 'users'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromUsersDocument(snapshot);
    });
}
export const updateProfilePic = async (file, currentUser) => {
  const url = await setFileToStorage(file);

  const updateProfilePic = {};
  updateProfilePic[`/users/${currentUser}/profilePictureURL`] = url;

  update(ref(database), updateProfilePic);
  return url;
}

export const updateProfileEmail = async (email, currentUser) => {
  const updateEmail = {};
  updateEmail[`/users/${currentUser}/email`] = email;

  return update(ref(database), updateEmail);
}

export const updateProfilePhone = async (phone, currentUser) => {
  const updatePhone = {};
  updatePhone[`/users/${currentUser}/phone`] = phone;

  return update(ref(database), updatePhone);
}

export const blockUser = (handle) => {
  const updateBlockedStatus = {};

  updateBlockedStatus[`/users/${handle}/blockedStatus`] = true;

  return update(ref(database), updateBlockedStatus);
}

export const unblockUser = (handle) => {
  const updateBlockedStatus = {};

  updateBlockedStatus[`/users/${handle}/blockedStatus`] = false;

  return update(ref(database), updateBlockedStatus);
}

export const makeAdminUser = (handle) => {
  const updateAdminStatus = {};

  updateAdminStatus[`/users/${handle}/role`] = "admin";

  return update(ref(database), updateAdminStatus);
}

export const removeAdminRights = (handle) => {
  const updateAdminStatus = {};

  updateAdminStatus[`/users/${handle}/role`] = "user";

  return update(ref(database), updateAdminStatus);
}