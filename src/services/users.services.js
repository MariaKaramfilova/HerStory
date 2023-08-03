import { get, set, ref, query, orderByChild, equalTo } from "firebase/database";
import { auth, database } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

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