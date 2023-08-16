import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase";

/**
 * Registers a new user with the provided email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<AuthCredential>} - A promise that resolves with the user's authentication credential.
 */
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs in a user with the provided email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user.
 * @returns {Promise<AuthCredential>} - A promise that resolves with the user's authentication credential.
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently authenticated user.
 *
 * @returns {Promise<void>} - A promise that resolves when the user is successfully logged out.
 */
export const logoutUser = () => {
  return signOut(auth);
};

/**
 * Sends a password reset email to the provided email address.
 *
 * @param {string} email - The email address for which the reset email will be sent.
 * @returns {Promise<void>} - A promise that resolves when the password reset email is sent successfully.
 */
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};
