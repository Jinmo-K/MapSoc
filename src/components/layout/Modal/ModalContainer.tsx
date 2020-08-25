import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../store/reducers';
import { ModalContent } from './ModalContent';
import { ModalNav } from './ModalNav';

interface IModalContainerProps {
  toggleModal: () => void;
}

export type ModalPage = 'Profile' | 'Security' | 'Settings';

export const ModalContainer: React.FC<IModalContainerProps> = ({ toggleModal }) => {
  const [currentPage, setCurrentPage] = useState<ModalPage>('Profile');
console.log('container')
  return (
    <div className='modal-container'>
      <ModalNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <ModalContent page={currentPage} />
      <button className='btn modal-close fadein-btn' onClick={toggleModal}>
        &times;
      </button>
    </div>
  );
};
