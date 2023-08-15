import { reauthenticateWithCredential } from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth";
import { updateProfilePhone } from "../../services/users.services";

export const PhoneChanging = async (user, loggedInUser, phone, username, setPhone) => {
  const password = prompt("Please enter your password to confirm phone change:");

  if (password) {
    const credentials = EmailAuthProvider.credential(loggedInUser.email, password);
    try {
      await reauthenticateWithCredential(user, credentials);
      if (phone) {
        await updateProfilePhone(phone, username);
        alert("Congratulations! You successfully changed your phone!");
        setPhone(phone);
      }
    } catch (error) {
      console.error(error);
    }
  }
};
