import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom/dist";
import DeleteAccountSection from "./DeleteAccountSection.jsx";
import EmailSection from "./EmailSection";
import PasswordSection from "./PasswordSection";
import PhoneSection from "./PhoneSection";
import ProfilePictureSection from "./ProfilePictureSection";
import { ACCOUNT_SETTINGS, HOME_PATH, ADMIN } from "../../common/common";

/**
 * Account Settings component that allows users to manage their account settings.
 * This component displays various sections for managing profile picture, password,
 * email, phone number, and account deletion.
 * 
 * @return {<AccountSettings />};
 */

const AccountSettings = () => {
  const { loggedInUser, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(true);
    }
    if (user) {
      setUserRole(loggedInUser.role);
    }
    setLoading(false);
  }, [loggedInUser]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginTop: "20px", flexGrow: 1 }}>{ACCOUNT_SETTINGS}</h1>
        <Link
          to={HOME_PATH}
          style={{
            display: "block",
            color: "black",
            fontSize: "23px",
            textDecoration: "none",
            marginRight: "15px",
          }}
        >
          Back To Home
        </Link>
      </div>
      <hr />
      <div>
        <ProfilePictureSection />
      </div>
      <hr />
      <div>
        <PasswordSection />
      </div>
      <div>
        <EmailSection />
      </div>

      {userRole === ADMIN && (
        <div>
          <PhoneSection />
        </div>
      )}

      <div>
        <DeleteAccountSection />
      </div>
    </div>
  );
};

export default AccountSettings;
