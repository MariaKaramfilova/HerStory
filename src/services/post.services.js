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
    };
  });
}

export const createPost = async (title, content = null, topic, file = null, handle, email) => {
  return push(
    ref(database, 'posts'),
    {
      title,
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
    update(ref(database), updateCommentIDequalToHandle)

    return getCommentsByPostHandle(result.key);
  });
}

export const getCommentsByPostHandle = async (postId) => {

  return get(query(ref(database, 'comments'), orderByChild('postId'), equalTo(postId)))
    .then(snapshot => {

      if (!snapshot.exists()) return [];

      return fromPostsDocument(snapshot);
    });
};

export const deleteCommentID = async (commentID) => {

  const commentLocation = commentID;

  try {

    await remove(ref(database, `comments/${commentLocation}`));
    console.log('Comment deleted successfully!');

  } catch (error) {
    throw new Error('Error deleting comment:', error);
  }

}



export function editPost(uid) {
  
}

export function deletePost(uid) {

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

export  const getPostsByAuthor = (handle) => {

  return get(query(ref(database, 'posts'), orderByChild('author'), equalTo(handle)))
    .then(snapshot => {

      if (!snapshot.exists()) return [];

      return fromPostsDocument(snapshot);
    });
};

// export const getPostsByEmail = (email) => {

//   return get(query(ref(database, 'Posts'), orderByChild('email'), equalTo(email)))
//     .then(snapshot => {

//       console.log(snapshot);
//       if (!snapshot.exists()) return [];

//       return fromPostsDocument(snapshot);
//     });
// };

export const upvotePost = (handle, postId) => {
  const updateUpvotes = {};
  updateUpvotes[`/posts/${postId}/upvotedBy/${handle}`] = true;
  updateUpvotes[`/users/${handle}/upvotedPosts/${postId}`] = true;

  return update(ref(database), updateUpvotes);
};

export const downvotePost = (handle, postId) => {
  const updateUpvotes = {};
  updateUpvotes[`/posts/${postId}/upvotedBy/${handle}`] = null;
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