import { deleteUser, reauthenticateWithCredential } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth";

export const DeleteAccount = async (user, loggedInUser) => {
  const password = prompt("Please enter your password to confirm account deletion:");

  if (password) {
    const credentials = EmailAuthProvider.credential(loggedInUser.email, password);
    try {
      await reauthenticateWithCredential(user, credentials);
      if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
        try {
          await deleteUser(user);
          return null;
        } catch (error) {
          console.error('An error occurred while deleting the account:', error);
          return "An error occurred while deleting your account. Please try again.";
        }
      }
    } catch (error) {
      console.error('An error occurred during re-authentication:', error);
      return "Failed to re-authenticate. Please check your password and try again.";
    }
  }

  return "An error occurred while confirming the deletion. Please try again.";
};
