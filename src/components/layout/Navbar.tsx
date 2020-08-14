import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

interface INavbarProps {
  isLoggedIn: boolean;
}

export const Navbar: React.FC<INavbarProps> = ({ isLoggedIn }) => {
  return (
    <nav className='navbar'>
      <Link to='/' role='banner'>
        MapSoc
      </Link>
      {
        (isLoggedIn)
        &&  <p>
              Profile Icon
            </p>
      }
    </nav>
  );
};

