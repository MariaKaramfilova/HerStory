import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const NavBar = () => {
  const [user] = useAuthState(auth);

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
        {user ? (
        <NavLink to="/create-post" className="nav-link text-danger">
          Create post
        </NavLink>
        ): (<NavLink to="/log-in" className="nav-link text-danger">
        Create post
      </NavLink>)}
      </NavItem>
    </Nav>
  );
};

export default NavBar;