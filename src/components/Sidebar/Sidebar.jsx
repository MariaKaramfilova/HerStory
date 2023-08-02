import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

const NavBar = () => {
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
    </Nav>
  );
};

export default NavBar;