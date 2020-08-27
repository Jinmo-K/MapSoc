import React from 'react';

import { ModalPage } from './ModalContainer';

interface IModalNavProps {
  currentPage: ModalPage;
  setCurrentPage: (page: ModalPage) => void;
}

export const ModalNav: React.FC<IModalNavProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className='modal-nav' aria-label='Settings navigation'>

        {/* Profile */}
        <button 
          className={currentPage === 'Profile' ? 'btn modal-nav-btn modal-nav-selected' : 'btn modal-nav-btn'}
          title='Edit profile'
          onClick={() => setCurrentPage('Profile')}
        >
          <i className='fas fa-user-circle' />
        </button>

        {/* Security */}
        <button 
          className={currentPage === 'Security' ? 'btn modal-nav-btn modal-nav-selected' : 'btn modal-nav-btn'}
          title='Security'
          onClick={() => setCurrentPage('Security')}
        >
          <i className='fas fa-lock' />
        </button>

        {/* Settings */}
        <button 
          className={currentPage === 'Settings' ? 'btn modal-nav-btn modal-nav-selected' : 'btn modal-nav-btn'}
          title='Settings'
          onClick={() => setCurrentPage('Settings')}
        >
          <i className='fas fa-cog' />
        </button>
      </nav>
  );
};
