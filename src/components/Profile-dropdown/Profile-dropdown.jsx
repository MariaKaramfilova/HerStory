import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { logoutUser } from '../../services/auth.services';
import { getUserData } from '../../services/users.services';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ProfileDropdown = () => {
  const { user } = useContext(AuthContext);
  const [profilePictureURL, setProfilePictureURL] = useState("https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png");

  useEffect(() => {
    const getProfilePictureURL = async () => {
      try {
        const snapshot = await getUserData(user.uid);
        const userData = snapshot.val();
        const profileData = Object.values(userData).find((el) => el.uid === user.uid);
        if (profileData) {
          setProfilePictureURL(user.photoURL);
        }
      } catch (error) {
        console.error('Error fetching profile picture URL:', error);
      }
    };

    if (user) {
      getProfilePictureURL();
    }
  }, [user]);
  return (
    <div>
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        <img
          src={profilePictureURL ? (profilePictureURL):("https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png")}
          alt="Profile Icon"
          style={{ width: '30px', height: '30px', borderRadius: '50%' }}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu  className="ml-auto">
        <Dropdown.Item href="'/log-in'">My Account</Dropdown.Item>

        <Dropdown.Item href="#">Account</Dropdown.Item>
        <Dropdown.Item href="account-settings">Account Settings</Dropdown.Item>
        <Button
            type="button"
            variant="danger"
            onClick={logoutUser}
          >
            Log Out
          </Button>

      </Dropdown.Menu>
    </Dropdown>
    </div>
  );
};



export default ProfileDropdown;
