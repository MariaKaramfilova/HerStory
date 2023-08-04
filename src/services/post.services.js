import { database } from "../config/firebase.js";
import { get, ref, query, orderByChild, equalTo, push, update } from "firebase/database";
import { setFileToStorage } from "./storage.services.js";

const fromPostsDocument = snapshot => {
  const postsDocument = snapshot.val();

  return Object.keys(postsDocument).map(key => {
    const post = postsDocument[key];

    return {
      ...post,
      id: key,
      createdOn: new Date(post.createdOn),
      likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
    };
  });
}

export const createPost = async (title, content = null, topic, file = null, handle) => {
  return push(
    ref(database, 'posts'),
    {
      title,
      content,
      topic,
      file: await setFileToStorage(file),
      author: handle,
      createdOn: Date.now(),
    },
  )
    .then(result => {

      return getPostById(result.key);
    });
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
      if (!post.likedBy) post.likedBy = [];

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

  return get(query(ref(database, 'Posts'), orderByChild('author'), equalTo(handle)))
    .then(snapshot => {
      if (!snapshot.exists()) return [];

      return fromPostsDocument(snapshot);
    });
};

export const likePost = (handle, postId) => {
  const updateLikes = {};
  updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
  updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;

  return update(ref(database), updateLikes);
};

export const dislikePost = (handle, postId) => {
  const updateLikes = {};
  updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
  updateLikes[`/users/${handle}/likedPosts/${postId}`] = null;

  return update(ref(database), updateLikes);
};

export const getLikedPosts = (handle) => {

  return get(ref(database, `users/${handle}`))
    .then(snapshot => {
      if (!snapshot.val()) {
        throw new Error(`User with handle @${handle} does not exist!`);
      }

      const user = snapshot.val();
      if (!user.likedPosts) return [];

      return Promise.all(Object.keys(user.likedPosts).map(key => {

        return get(ref(database, `posts/${key}`))
          .then(snapshot => {
            const post = snapshot.val();

            return {
              ...post,
              createdOn: new Date(post.createdOn),
              id: key,
              likedBy: post.likedBy ? Object.keys(post.likedBy) : [],
            };
          });
      }));
    });
};