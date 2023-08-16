import React, { useContext } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import { ABOUT_BUTTON_MESSAGE, ABOUT_PATH, CREATE_POST_BUTTON_MESSAGE, CREATE_POST_PATH, HOME_BUTTON_MESSAGE, HOME_PATH } from '../../common/common.js';

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
        <NavLink to={HOME_PATH} className="nav-link text-danger">
          {HOME_BUTTON_MESSAGE}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to={ABOUT_PATH} className="nav-link text-danger">
          {ABOUT_BUTTON_MESSAGE}
        </NavLink>
      </NavItem>
      <NavItem>
        {user &&
          <NavLink to={CREATE_POST_PATH} className="nav-link text-danger">
            {CREATE_POST_BUTTON_MESSAGE}
          </NavLink>
        }
      </NavItem>
    </Nav>
  );
};

export default NavBar;