import { updateEmail, reauthenticateWithCredential } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth";
import { updateProfileEmail } from "../../services/users.services";

export const EmailChanging = async (user, loggedInUser, email, username) => {
  const password = prompt("Please enter your password to confirm email change:");

  if (password) {
    const credentials = EmailAuthProvider.credential(loggedInUser.email, password);
    try {
      await reauthenticateWithCredential(user, credentials);
      if (email) {
        await updateEmail(user, email);
        await updateProfileEmail(email, username);
        return null;
      }
    } catch (error) {
      console.error(error);
      return "Invalid email or password! Please try again.";
    }
  }

  return "An error occurred while changing the email. Please try again.";
};
