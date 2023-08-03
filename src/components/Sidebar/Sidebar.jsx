import { NavLink} from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const {user} = useContext(AuthContext)
  return (
    <nav className='side-bar'>
    <ul>
      <li>
        <NavLink to="/home">Home</NavLink>
    </li>
    {user ? (
    <li>
        <NavLink to="/about">About</NavLink>
    </li>
    ): (
      <li>
      <NavLink to="/sign-up">About</NavLink>
      </li>
    )}
    </ul>
  </nav>
  );
};

export default Sidebar;