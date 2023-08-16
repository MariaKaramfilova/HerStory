import React, { useContext } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import { ABOUT_BUTTON_MESSAGE, CREATE_POST_BUTTON_MESSAGE, HOME_BUTTON_MESSAGE } from '../../common/common.js';

/**
 * The NavBar component displays navigation links in the side bar.
 *
 * @returns {JSX.Element} - JSX representing the NavBar component.
 */
const NavBar = () => {
  const { user } = useContext(AuthContext);

  return (
    <Nav className='side-bar'>
      <NavItem>
        <NavLink to="/home" className="nav-link text-danger">
          {HOME_BUTTON_MESSAGE}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/about" className="nav-link text-danger">
          {ABOUT_BUTTON_MESSAGE}
        </NavLink>
      </NavItem>
      <NavItem>
        {user &&
          <NavLink to="/create-post" className="nav-link text-danger">
            {CREATE_POST_BUTTON_MESSAGE}
          </NavLink>
        }
      </NavItem>
    </Nav>
  );
};

export default NavBar;