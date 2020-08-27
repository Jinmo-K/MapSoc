import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './Modal.css';

const modalRoot = document.getElementById('modalRoot');

interface IModalProps {
  children: JSX.Element;
}

export const Modal: React.FC<IModalProps> = ({ children }) => {
  const [el, _] = useState(document.createElement('div'));

  useEffect(() => {
    modalRoot!.appendChild(el);
    return () => {
      modalRoot!.removeChild(el);
    }
  }, []);

  return ReactDOM.createPortal(children, el);
};
