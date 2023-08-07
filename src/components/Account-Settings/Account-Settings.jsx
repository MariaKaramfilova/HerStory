import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { useAuthState } from 'react-firebase-hooks/auth'

const AccountSettings = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  const handleChangePassword = async () => {
    try {
      await auth.user.updatePassword(newPassword);
      setNewPassword("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Account Settings</h2>
      <div>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default AccountSettings;
