import React from 'react';
import { Link } from 'react-router-dom';

import { AuthAction } from '../../../store/actions';

import './Navbar.css';

interface INavbarProps {
  isLoggedIn: boolean;
  logout: () => void;
  toggleModal: () => void;
}

export const Navbar: React.FC<INavbarProps> = ({ isLoggedIn, logout, toggleModal }) => {
  return (
    <nav className='navbar'>
      <Link to='/' role='banner' className='navbar-brand'>
        MapSoc
      </Link>
      {
        (isLoggedIn)
        &&  <section className='user-menu'>
              {/* Profile button */}
              <button 
                className='btn navbar-btn fadein-btn'
                title='Edit profile'
                onClick={toggleModal}
              >
                <i className='fas fa-user-circle' />
              </button>

              {/* Logout button */}
              <button 
                className='btn navbar-btn fadein-btn'
                title='Logout'
                onClick={logout}
              >
                <i className='fas fa-sign-out-alt' />
              </button>
            </section>
      }
    </nav>
  );
};
