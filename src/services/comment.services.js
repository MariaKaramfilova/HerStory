import { database } from "../config/firebase.js";
import {
  get,
  ref,
  query,
  orderByChild,
  equalTo,
  push,
  update,
  remove,
} from "firebase/database";
import { fromPostsDocument } from "./post.services.js";

/**
 * Creates a new comment on a post.
 *
 * @param {string|null} content - The content of the comment.
 * @param {string} author - The author's handle.
 * @param {string} postId - The ID of the post the comment belongs to.
 * @param {string} userUid - The user's unique ID.
 * @returns {Promise<Array>} - A promise that resolves with an array of comments for the post.
 */
export const createComment = async (
  content = null,
  author,
  postId,
  userUid
) => {
  return push(ref(database, "comments"), {
    author,
    content,
    createdOn: Date.now(),
    postId,
    commentId: "null",
    userUid,
  }).then((result) => {
    const updateCommentIDequalToHandle = {};
    updateCommentIDequalToHandle[`/comments/${result.key}/commentId`] =
      result.key;
    updateCommentIDequalToHandle[
      `/posts/${postId}/hasComment/${result.key}`
    ] = true;

    update(ref(database), updateCommentIDequalToHandle);

    return getCommentsByPostHandle(result.key);
  });
};

/**
 * Fetches a comment by its ID.
 *
 * @param {string} commentId - The ID of the comment to fetch.
 * @returns {Promise<Object>} - A promise that resolves with the fetched comment object.
 */

export const getCommentById = async (commentId) => {
  const commentRef = ref(database, `comments/${commentId}`);

  try {
    const commentSnapshot = await get(commentRef);
    if (commentSnapshot.exists()) {
      const commentData = commentSnapshot.val();
      return commentData;
    } else {
      throw new Error("Comment not found");
    }
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
};

/**
 * Fetches comments associated with a specific post.
 *
 * @param {string} postId - The ID of the post for which to fetch comments.
 * @returns {Promise<Array>} - A promise that resolves with an array of comments for the post.
 */
export const getCommentsByPostHandle = async (postId) => {
  return get(
    query(ref(database, "comments"), orderByChild("postId"), equalTo(postId))
  ).then((snapshot) => {
    if (!snapshot.exists()) return [];

    return fromPostsDocument(snapshot);
  });
};

/**
 * Fetches all comments from the database.
 *
 * @returns {Promise<Array>} - A promise that resolves with an array of all comments.
 */
export const getAllComments = () => {
  return get(ref(database, "comments")).then((snapshot) => {
    if (!snapshot.exists()) {
      return [];
    }

    return fromPostsDocument(snapshot);
  });
};

/**
 * Deletes a comment by its ID.
 *
 * @param {string} commentID - The ID of the comment to delete.
 * @param {string} postId - The ID of the post to which the comment belongs.
 * @returns {Promise<void>} - A promise that resolves when the comment is successfully deleted.
 * @throws {Error} - If there's an error while deleting the comment.
 */
export const deleteCommentID = async (commentID, postId) => {
  const commentLocation = commentID;
  try {
    await remove(ref(database, `comments/${commentLocation}`));
    const updateComment = {};
    updateComment[`/posts/${postId}/hasComment/${commentID}`] = null;
    update(ref(database), updateComment);

    console.log("Comment deleted successfully!");
  } catch (error) {
    throw new Error("Error deleting comment:", error);
  }
};

/**
 * Edits an existing comment.
 *
 * @param {string} commentId - The ID of the comment to edit.
 * @param {string} newContent - The new content of the comment.
 * @returns {Promise<void>} - A promise that resolves when the comment is successfully edited.
 * @throws {Error} - If there's an error while editing the comment.
 */
export const editComment = async (commentId, newContent) => {
  const commentRef = ref(database, `comments/${commentId}`);
  const editedCommentData = {
    content: newContent,
    editedOn: Date.now(),
  };

  try {
    await update(commentRef, editedCommentData);
  } catch (error) {
    console.error("Error editing comment:", error);
    throw error;
  }
};
