import React, { useState } from 'react';

import { ModalContent } from './ModalContent';
import { ModalNav } from './ModalNav';

interface IModalContainerProps {
  toggleModal: () => void;
}

export type ModalPage = 'Profile' | 'Security' | 'Settings';

export const ModalContainer: React.FC<IModalContainerProps> = ({ toggleModal }) => {
  const [currentPage, setCurrentPage] = useState<ModalPage>('Profile');
  
  return (
    <>
      <div className='modal'>
        <div className='overlay' onClick={toggleModal} />
        <div className='modal-container'>
          <ModalNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <div className='modal-content'>
            <ModalContent page={currentPage} />
          </div>
          <button className='btn modal-close fadein-btn' onClick={toggleModal}>
            &times;
          </button>
        </div>
      </div>
      
    </>
  );
};
