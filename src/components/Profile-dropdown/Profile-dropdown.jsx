import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { logoutUser } from '../../services/auth.services';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { DEFAULT_PROF_PIC_DIR } from '../../common/common.js';

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
            src={profilePictureURL ? (profilePictureURL) : (DEFAULT_PROF_PIC_DIR)}
            alt="Profile Icon"
            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
          />
          <span>{loggedInUser.username}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="ml-auto">
          <Dropdown.Item onClick={handleMyAccount}>My Account</Dropdown.Item>
          <Dropdown.Item onClick={handleAccountSettings}>Account Settings</Dropdown.Item>
          <Dropdown.Item onClick={logoutUser}>Log Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>}
    </div>
  );
};



export default ProfileDropdown;
