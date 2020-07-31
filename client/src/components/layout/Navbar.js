import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-sm align-items-middle'>
      <Link className='navbar-brand' to='/'>MapSoc</Link>
      <button className='navbar-toggler' type='button'>
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse'>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <Link to='/settings' className='nav-link nav-btn pb-0'>
              Settings
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/settings' className='nav-link nav-btn pb-0'>
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
