import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { logoutUser } from '../../services/auth.services';

const ProfileDropdown = () => {
  return (
    <div>
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        <img
          src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png" // Replace with your profile icon URL
          alt="Profile Icon"
          style={{ width: '30px', height: '30px', borderRadius: '50%' }}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu  className="ml-auto">
        <Dropdown.Item href="'/log-in'">My Account</Dropdown.Item>

        <Dropdown.Item href="#">Account</Dropdown.Item>
        
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
