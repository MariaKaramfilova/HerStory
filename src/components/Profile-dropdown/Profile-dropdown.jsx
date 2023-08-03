import React from 'react';
import { Dropdown } from 'react-bootstrap';

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
        <Dropdown.Item href="#action/1">My Account</Dropdown.Item>

        <Dropdown.Item href="#action/2">Account</Dropdown.Item>
        
        <Dropdown.Item href="#action/3">Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </div>
  );
};



export default ProfileDropdown;
