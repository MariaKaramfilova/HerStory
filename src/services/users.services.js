import { get, set, ref, query, orderByChild, equalTo } from "firebase/database";
import { auth, database } from "../config/firebase";

const fromUsersDocument = snapshot => {
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

export const createUserByUsername = (firstName, lastName, uid, email, username) => {
    return set(ref(database, `users/${username}`), {
        firstName,
        lastName,
        uid,
        username,
        email,
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