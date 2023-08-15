import { get, set, ref, query, orderByChild, equalTo, update, remove } from "firebase/database";
import { auth, database } from "../config/firebase";
import { setFileToStorage } from "./storage.services.js";
import { deleteCommentID, deletePost } from "./post.services.js";

/**
 * Transforms the users document snapshot into an array of user objects.
 *
 * @param {DataSnapshot} snapshot - The snapshot of the users document.
 * @returns {Array} - An array of user objects.
 */
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

/**
 * Retrieves a user by their username.
 *
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves with the retrieved user object.
 */
export const getUserByUsername = (username) => {
  return get(ref(database, `users/${username}`));
}

/**
 * Creates a new user using their username as the key.
 *
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} uid - The user's UID.
 * @param {string} email - The user's email.
 * @param {string} username - The username of the user.
 * @param {string} profilePictureURL - The URL of the user's profile picture.
 * @returns {Promise<void>} - A promise that resolves after creating the user.
 */
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

/**
 * Retrieves user data by UID.
 *
 * @param {string} uid - The UID of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves with the retrieved user object.
 */
export const getUserData = (uid) => {
  return get(ref(database, 'users'), orderByChild('uid'), equalTo(uid))
}

/**
 * Retrieves all users.
 *
 * @returns {Promise<Array>} - A promise that resolves with an array of user objects.
 */
export const getAllUsers = () => {
  return get(ref(database, 'users'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromUsersDocument(snapshot);
    });
}

/**
 * Updates the profile picture URL for a user.
 *
 * @param {File} file - The new profile picture file.
 * @param {string} currentUser - The username of the current user.
 * @returns {Promise<string>} - A promise that resolves with the updated profile picture URL.
 */
export const updateProfilePic = async (file, currentUser) => {
  const url = await setFileToStorage(file);

  const updateProfilePic = {};
  updateProfilePic[`/users/${currentUser}/profilePictureURL`] = url;

  update(ref(database), updateProfilePic);
  return url;
}

/**
 * Updates the email address for a user.
 *
 * @param {string} email - The new email address.
 * @param {string} currentUser - The username of the current user.
 * @returns {Promise<void>} - A promise that resolves after updating the email.
 */
export const updateProfileEmail = async (email, currentUser) => {
  const updateEmail = {};
  updateEmail[`/users/${currentUser}/email`] = email;

  return update(ref(database), updateEmail);
}

/**
 * Updates the phone number for a user.
 *
 * @param {string} phone - The new phone number.
 * @param {string} currentUser - The username of the current user.
 * @returns {Promise<void>} - A promise that resolves after updating the phone number.
 */
export const updateProfilePhone = async (phone, currentUser) => {
  const updatePhone = {};
  updatePhone[`/users/${currentUser}/phone`] = phone;

  return update(ref(database), updatePhone);
}

/**
 * Blocks a user.
 *
 * @param {string} handle - The username of the user to block.
 * @returns {Promise<void>} - A promise that resolves after blocking the user.
 */
export const blockUser = (handle) => {
  const updateBlockedStatus = {};

  updateBlockedStatus[`/users/${handle}/blockedStatus`] = true;

  return update(ref(database), updateBlockedStatus);
}

/**
 * Unblocks a user.
 *
 * @param {string} handle - The username of the user to unblock.
 * @returns {Promise<void>} - A promise that resolves after unblocking the user.
 */
export const unblockUser = (handle) => {
  const updateBlockedStatus = {};

  updateBlockedStatus[`/users/${handle}/blockedStatus`] = false;

  return update(ref(database), updateBlockedStatus);
}

/**
 * Grants admin privileges to a user.
 *
 * @param {string} handle - The username of the user to make an admin.
 * @returns {Promise<void>} - A promise that resolves after granting admin privileges.
 */
export const makeAdminUser = (handle) => {
  const updateAdminStatus = {};

  updateAdminStatus[`/users/${handle}/role`] = "admin";

  return update(ref(database), updateAdminStatus);
}

/**
 * Removes admin privileges from a user.
 *
 * @param {string} handle - The username of the user to remove admin rights from.
 * @returns {Promise<void>} - A promise that resolves after removing admin privileges.
 */
export const removeAdminRights = (handle) => {
  const updateAdminStatus = {};

  updateAdminStatus[`/users/${handle}/role`] = "user";

  return update(ref(database), updateAdminStatus);
}

/**
 * Deletes a user's data, including their posts, comments, and votes.
 *
 * @param {string} userHandle - The username of the user to delete.
 * @param {Array} posts - An array of objects representing the user's posts.
 * @param {Array} comments - An array of objects representing the user's comments.
 * @param {Array} upvoted - An array of post IDs upvoted by the user.
 * @param {Array} downvoted - An array of post IDs downvoted by the user.
 * @returns {Promise<void>} - A promise that resolves after deleting the user's data.
 */
export async function deleteUserData(userHandle, posts, comments, upvoted, downvoted) {

  await remove(ref(database, `users/${userHandle}`));

  posts.map(async (post) => {
    await deletePost(post.postId);
  })

  comments.map(async (comment) => {
    await deleteCommentID(comment.commentId, comment.postId);
  })

  const updateVotesDeletion = {};
  upvoted.forEach((postId) => {
    updateVotesDeletion[`/posts/${postId}/upvotedBy/${userHandle}`] = null;
  });

  const updateDownVotesDeletion = {};
  downvoted.forEach((postId) => {
    updateDownVotesDeletion[`/posts/${postId}/downvotedBy/${userHandle}`] = null;
  });

  const updates = {
    ...updateVotesDeletion,
    ...updateDownVotesDeletion,
  };
  await update(ref(database), updates);

  console.log('User and associated comments & posts deleted successfully');
}