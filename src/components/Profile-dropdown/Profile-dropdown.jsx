import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { logoutUser } from '../../services/auth.services';
import { getUserData } from '../../services/users.services';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

/**
 * A dropdown component that displays user profile options like "My Account", "Account Settings", and "Log Out".
 *
 * Renders a dropdown menu with profile-related options, including handling user navigation and logout.
 *
 * @component
 * @returns {JSX.Element} Rendered component displaying user profile dropdown.
 * @example
 * return (
 *   <ProfileDropdown />
 * );
 */
const ProfileDropdown = () => {
  const { loggedInUser, user } = useContext(AuthContext);
  const [profilePictureURL, setProfilePictureURL] = useState(user ? loggedInUser.profilePictureURL : '');
  const navigate = useNavigate();

  const handleMyAccount = () => {
    navigate(`/my-account`);
  }

  const handleAccountSettings = () => {
    navigate('/account-settings')
  }

  return (
    <div>
      {user === undefined ? <Skeleton width={50} height={50} /> : <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <img
            src={profilePictureURL ? (profilePictureURL) : ('../../assets/basic_avatar.png')}
            alt="Profile Icon"
            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
          />
        </Dropdown.Toggle>

        <Dropdown.Menu className="ml-auto">
          <Dropdown.Item onClick={handleMyAccount}>My Account</Dropdown.Item>
          <Dropdown.Item onClick={handleAccountSettings}>Account Settings</Dropdown.Item>
          <Dropdown.Item onClick={logoutUser}>Log Out</Dropdown.Item>

          {/* <Button
            type="button"
            variant="danger"
            onClick={() => {
              logoutUser();
              navigate('/home');
            }}
          >
            Log Out
          </Button> */}

        </Dropdown.Menu>
      </Dropdown>}
    </div>
  );
};



export default ProfileDropdown;
