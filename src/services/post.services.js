import { database } from "../config/firebase.js";
import { get, ref, query, orderByChild, equalTo, push, update, remove } from "firebase/database";
import { setFileToStorage } from "./storage.services.js";

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

export const getCommentsByPostHandle = async (postId) => {

  return get(query(ref(database, 'comments'), orderByChild('postId'), equalTo(postId)))
    .then(snapshot => {

      if (!snapshot.exists()) return [];

      return fromPostsDocument(snapshot);
    });
};

export const getAllComments = () => {

  return get(ref(database, 'comments'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromPostsDocument(snapshot);
    });
};

export const deleteCommentID = async (commentID, postId) => {
  console.log(postId);
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

export const getAllPosts = () => {

  return get(ref(database, 'posts'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromPostsDocument(snapshot);
    });
};

export const getPostsByAuthor = (handle) => {

  return get(query(ref(database, 'posts'), orderByChild('author'), equalTo(handle)))
    .then(snapshot => {

      if (!snapshot.exists()) return [];

      return fromPostsDocument(snapshot);
    });
};

export const upvotePost = (handle, postId) => {
  const updateUpvotes = {};
  updateUpvotes[`/posts/${postId}/upvotedBy/${handle}`] = true;
  updateUpvotes[`/posts/${postId}/downvotedBy/${handle}`] = null;
  updateUpvotes[`/users/${handle}/upvotedPosts/${postId}`] = true;

  return update(ref(database), updateUpvotes);
};

export const downvotePost = (handle, postId) => {
  const updateUpvotes = {};
  updateUpvotes[`/posts/${postId}/upvotedBy/${handle}`] = null;
  updateUpvotes[`/posts/${postId}/downvotedBy/${handle}`] = true;
  updateUpvotes[`/users/${handle}/upvotedPosts/${postId}`] = null;

  return update(ref(database), updateUpvotes);
};

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

export const addPostTags = (postId, tags) => {
  const updatePostTags = {};
  tags.map(tag => {
    updatePostTags[`/posts/${postId}/tags/${tag}`] = true;
  })

  return update(ref(database), updatePostTags);
};

export const removePostTags = async (postId, tags) => {
  const promises = [];
  tags.forEach(tag => {
    const updatePostTags = {};
    updatePostTags[`/posts/${postId}/tags/${tag.value}`] = null;
    return update(ref(database), updatePostTags);
  });
  await Promise.all(promises);
}

