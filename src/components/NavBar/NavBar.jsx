import React, { useContext } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';

const NavBar = () => {
  const { loggedInUser } = useContext(AuthContext);

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
        {loggedInUser &&
          <NavLink to="/create-post" className="nav-link text-danger">
            Create post
          </NavLink>
        }
      </NavItem>
    </Nav>
  );
};

export default NavBar;