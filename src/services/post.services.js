import { database } from "../config/firebase.js";
import { get, ref, query, orderByChild, equalTo, push, update, remove } from "firebase/database";
import { setFileToStorage } from "./storage.services.js";

/**
 * Transforms the posts document snapshot into an array of post objects.
 *
 * @param {DataSnapshot} snapshot - The snapshot of the posts document.
 * @returns {Array} - An array of post objects.
 */
const fromPostsDocument = snapshot => {
  const postsDocument = snapshot.val();


  return Object.keys(postsDocument).map(key => {
    const post = postsDocument[key];

    return {
      ...post,
      id: key,
      createdOn: new Date(post.createdOn),
      upvotedBy: post.upvotedBy ? Object.keys(post.upvotedBy) : [],
      downvotedBy: post.downvotedBy ? Object.keys(post.downvotedBy) : [],
      hasComment: post.hasComment ? Object.keys(post.hasComment) : [],
    };
  });
}

/**
 * Creates a new post.
 *
 * @param {string} title - The title of the post.
 * @param {string|null} content - The content of the post.
 * @param {string} topic - The topic of the post.
 * @param {File|null} file - The file associated with the post.
 * @param {string} handle - The author's handle.
 * @param {string} email - The author's email.
 * @param {string} userId - The author's user ID.
 * @returns {Promise<Object>} - A promise that resolves with the created post object.
 */
export const createPost = async (title, content = null, topic, file = null, handle, email, userId) => {
  return push(
    ref(database, 'posts'),
    {
      title,
      userId,
      content,
      topic,
      file: file ? await setFileToStorage(file) : null,
      fileType: file ? file.type.split('/')[0] : null,
      author: handle,
      email: email,
      createdOn: Date.now(),
      postId: 'null',
    },
  )
    .then(result => {
      const updatePostIDequalToHandle = {};
      updatePostIDequalToHandle[`/posts/${result.key}/postId`] = result.key;
      update(ref(database), updatePostIDequalToHandle)

      return getPostById(result.key);
    });
}

/**
 * Edits an existing post.
 *
 * @param {string} postId - The ID of the post to edit.
 * @param {string} title - The new title of the post.
 * @param {string} topic - The new topic of the post.
 * @param {string|null} content - The new content of the post.
 * @param {File|null} file - The new file associated with the post.
 * @returns {Promise<Object>} - A promise that resolves with the edited post object.
 */
export const editPost = async (postId, title, topic, content = null, file = null) => {
  let updates;

  if(content){
     updates = {
      title,
      content,
      topic,
    };
  }

  if(file){
    updates = {
      title,
      file: file ? await setFileToStorage(file) : null,
      topic,
    };
  }

  try {
    await update(ref(database, `posts/${postId}`), updates);
    console.log('Post updated successfully!');
    return getPostById(postId);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

/**
 * Creates a new comment on a post.
 *
 * @param {string|null} content - The content of the comment.
 * @param {string} author - The author's handle.
 * @param {string} postId - The ID of the post the comment belongs to.
 * @param {string} userUid - The user's unique ID.
 * @returns {Promise<Array>} - A promise that resolves with an array of comments for the post.
 */
export const createComment = async (content = null, author, postId, userUid) => {
  return push(
    ref(database, 'comments'),
    {
      author,
      content,
      createdOn: Date.now(),
      postId,
      commentId: 'null',
      userUid,
    },
  )
    .then(result => {
      const updateCommentIDequalToHandle = {};
      updateCommentIDequalToHandle[`/comments/${result.key}/commentId`] = result.key;
      updateCommentIDequalToHandle[`/posts/${postId}/hasComment/${result.key}`] = true;

      update(ref(database), updateCommentIDequalToHandle)

      return getCommentsByPostHandle(result.key);
    });
}
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
      throw new Error('Comment not found');
    }
  } catch (error) {
    console.error('Error fetching comment:', error);
    throw error;
  }
}

/**
 * Fetches comments associated with a specific post.
 *
 * @param {string} postId - The ID of the post for which to fetch comments.
 * @returns {Promise<Array>} - A promise that resolves with an array of comments for the post.
 */
export const getCommentsByPostHandle = async (postId) => {

  return get(query(ref(database, 'comments'), orderByChild('postId'), equalTo(postId)))
    .then(snapshot => {

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

  return get(ref(database, 'comments'))
    .then(snapshot => {
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

    console.log('Comment deleted successfully!');

  } catch (error) {
    throw new Error('Error deleting comment:', error);
  }

}

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
    console.error('Error editing comment:', error);
    throw error;
  }
};

/**
 * Deletes a post and its associated comments.
 *
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<void>} - A promise that resolves when the post and comments are deleted.
 */
export async function deletePost(postId) {

  await remove(ref(database, `posts/${postId}`));

  const comments = await getCommentsByPostHandle(postId);
  const commentIds = Object.keys(comments);
  const removeCommentsPromises = commentIds.map(commentId =>
    remove(ref(database, `comments/${commentId}`))
  );

  await Promise.all(removeCommentsPromises);

  console.log('Post and associated comments deleted successfully');

}

/**
 * Fetches a post by its ID.
 *
 * @param {string} id - The ID of the post to fetch.
 * @returns {Promise<Object>} - A promise that resolves with the fetched post object.
 * @throws {Error} - If the post with the specified ID does not exist.
 */
export const getPostById = (id) => {

  return get(ref(database, `posts/${id}`))
    .then(result => {
      if (!result.exists()) {
        throw new Error(`Post with id ${id} does not exist!`);
      }

      const post = result.val();
      post.id = id;
      post.createdOn = new Date(post.createdOn);
      if (!post.upvotedBy) post.upvotedBy = [];

      return post;
    });
};

/**
 * Fetches all posts from the database.
 *
 * @returns {Promise<Array>} - A promise that resolves with an array of all posts.
 */
export const getAllPosts = () => {

  return get(ref(database, 'posts'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromPostsDocument(snapshot);
    });
};

/**
 * Fetches posts authored by a specific user handle.
 *
 * @param {string} handle - The handle of the user.
 * @returns {Promise<Array>} - A promise that resolves with an array of posts authored by the user.
 */
export const getPostsByAuthor = (handle) => {

  return get(query(ref(database, 'posts'), orderByChild('author'), equalTo(handle)))
    .then(snapshot => {

      if (!snapshot.exists()) return [];

      return fromPostsDocument(snapshot);
    });
};

/**
 * Upvotes a post.
 *
 * @param {string} handle - The handle of the user performing the upvote.
 * @param {string} postId - The ID of the post to upvote.
 * @returns {Promise<void>} - A promise that resolves when the post is successfully upvoted.
 */
export const upvotePost = (handle, postId) => {
  const updateUpvotes = {};
  updateUpvotes[`/posts/${postId}/upvotedBy/${handle}`] = true;
  updateUpvotes[`/posts/${postId}/downvotedBy/${handle}`] = null;
  updateUpvotes[`/users/${handle}/upvotedPosts/${postId}`] = true;
  updateUpvotes[`/users/${handle}/downvotedPosts/${postId}`] = null;
  updateUpvotes[`/users/${handle}/downvotedPosts/${postId}`] = null;

  return update(ref(database), updateUpvotes);
};

/**
 * Downvotes a post.
 *
 * @param {string} handle - The handle of the user performing the downvote.
 * @param {string} postId - The ID of the post to downvote.
 * @returns {Promise<void>} - A promise that resolves when the post is successfully downvoted.
 */
export const downvotePost = (handle, postId) => {
  const updateUpvotes = {};
  updateUpvotes[`/posts/${postId}/upvotedBy/${handle}`] = null;
  updateUpvotes[`/posts/${postId}/downvotedBy/${handle}`] = true;
  updateUpvotes[`/users/${handle}/upvotedPosts/${postId}`] = null;
  updateUpvotes[`/users/${handle}/downvotedPosts/${postId}`] = true;

  return update(ref(database), updateUpvotes);
};

/**
 * Removes tags from a post.
 *
 * @param {string} postId - The ID of the post to remove tags from.
 * @param {Array<string>} tags - An array of tags to remove.
 * @returns {Promise<void>} - A promise that resolves when the tags are successfully removed from the post.
 */
export const getUpvotedPosts = (handle) => {

  return get(ref(database, `users/${handle}`))
    .then(snapshot => {
      if (!snapshot.val()) {
        throw new Error(`User with handle @${handle} does not exist!`);
      }

      const user = snapshot.val();
      if (!user.upvotedPosts) return [];

      return Promise.all(Object.keys(user.upvotedPosts).map(key => {

        return get(ref(database, `posts/${key}`))
          .then(snapshot => {
            const post = snapshot.val();

            return {
              ...post,
              createdOn: new Date(post.createdOn),
              id: key,
              upvotedBy: post.upvotedBy ? Object.keys(post.upvotedBy) : [],
            };
          });
      }));
    });
};

/**
 * Adds tags to a post.
 *
 * @param {string} postId - The ID of the post to which tags will be added.
 * @param {Array<string>} tags - An array of tags to add to the post.
 * @returns {Promise<void>} - A promise that resolves when the tags are successfully added to the post.
 */
export const addPostTags = (postId, tags) => {
  const updatePostTags = {};
  tags.map(tag => {
    updatePostTags[`/posts/${postId}/tags/${tag}`] = true;
  })

  return update(ref(database), updatePostTags);
};

/**
 * Removes tags from a post.
 *
 * @param {string} postId - The ID of the post from which tags will be removed.
 * @param {Array<string>} tags - An array of tags to remove from the post.
 * @returns {Promise<void>} - A promise that resolves when the tags are successfully removed from the post.
 */
export const removePostTags = async (postId, tags) => {
  const promises = [];
  tags.forEach(tag => {
    const updatePostTags = {};
    updatePostTags[`/posts/${postId}/tags/${tag.value}`] = null;
    return update(ref(database), updatePostTags);
  });
  await Promise.all(promises);
}

