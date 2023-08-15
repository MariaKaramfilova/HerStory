import React, { useContext } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';

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
          Home
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/about" className="nav-link text-danger">
          About
        </NavLink>
      </NavItem>
      <NavItem>
        {user &&
          <NavLink to="/create-post" className="nav-link text-danger">
            Create post
          </NavLink>
        }
      </NavItem>
    </Nav>
  );
};

export default NavBar;