import { NavLink} from 'react-router-dom';
import React from 'react';

const Sidebar = () => {
  return (
    <nav className='side-bar'>
    <ul>
      <li>
        <NavLink to="/home">Home</NavLink>
    </li>
    <li>
        <NavLink to="/about">About</NavLink>
    </li>
    </ul>
  </nav>
  );
};

export default Sidebar;