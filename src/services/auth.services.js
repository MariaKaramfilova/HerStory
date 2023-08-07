import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";

export const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}
export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const logoutUser = () => {
    return signOut(auth);
}

export const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
}