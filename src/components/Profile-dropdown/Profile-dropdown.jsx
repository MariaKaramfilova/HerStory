import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { logoutUser } from '../../services/auth.services';
import { getUserData } from '../../services/users.services';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const navigate = useNavigate();

  const handleMyAccount = () => {
    navigate(`/my-account`);
  }

  const handleAccountSettings = () => {
    navigate('/account-settings')
  }

  useEffect(() => {
    const getProfilePictureURL = async () => {
      if (loggedInUser) {
        setProfilePictureURL(loggedInUser.profilePictureURL);
      }

    };

    if (loggedInUser) {
      getProfilePictureURL();
    }
  }, [loggedInUser]);
  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <img
            src={profilePictureURL ? (profilePictureURL) : ("https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png")}
            alt="Profile Icon"
            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu className="ml-auto">
          <Dropdown.Item onClick={handleMyAccount}>My Account</Dropdown.Item>
          <Dropdown.Item onClick={handleAccountSettings}>Account Settings</Dropdown.Item>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              logoutUser();
              navigate('/home');
            }}
          >
            Log Out
          </Button>

        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};



export default ProfileDropdown;
