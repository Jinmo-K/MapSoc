import React, { useState } from 'react';

import './Toolbar.css';

interface IToolbarProps {
  selectTool: (tool: string) => void;
}

const tools = [
  'pointer',
  'pencil',
  'eraser',
  'selection',
];

const icons: Record<string, JSX.Element> = {
  'pointer': <i className='fas fa-mouse-pointer' />,
  'pencil': <i className='fas fa-pencil-alt' />,
  'eraser': <i className='fas fa-eraser' />,
  'selection': <i className='fas fa-vector-square' />
}

const Toolbar: React.SFC<IToolbarProps> = ({ selectTool }) => {
  const [currentTool, setCurrentTool] = useState('pointer');

  return (
    <section className='toolbar'>
      {
        tools.map(tool => {
          return (
            <button 
              id={tool + '-btn'} 
              key={tool}
              name={tool}
              className={currentTool === tool ? 'btn toolbar-btn toolbar-btn-selected' : 'btn toolbar-btn'}
              onClick={() => {
                setCurrentTool(tool);
                selectTool(tool);
              }}
              title={tool}
            >
              {icons[tool]}
            </button>
          )
        })
      }
    </section>
  );
} 

export default React.memo(Toolbar);
