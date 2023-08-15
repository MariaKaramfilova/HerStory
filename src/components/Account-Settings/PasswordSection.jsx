import { updatePassword, } from "firebase/auth";

export const PasswordChanging = async  (user, password, confirmPassword) => {
    try {
        const lastSignInTime = new Date(user.metadata.lastSignInTime);
        const currentTime = new Date();
    
        const timeDifferenceInMinutes =
          (currentTime - lastSignInTime) / (1000 * 60);
        const acceptableTimeDifference = 5;
    
        if (timeDifferenceInMinutes <= acceptableTimeDifference) {
          if (password && confirmPassword) {
            if (password === confirmPassword) {
              await updatePassword(user, password);
              return null;
            } else {
              return "Passwords do not match";
            }
          } else {
            return "Please enter your password in both fields";
          }
        } else {
          return "For security reasons, please sign in again before changing your password";
        }
      } catch (error) {
        console.error(error);
        return "An error occurred while changing the password. Please try again.";
      }
};
