import React from 'react';

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

const Toolbar: React.FC<IToolbarProps> = ({ selectTool }) => {
  return (
    <section className='toolbar'>
      {
        tools.map(tool => {
          return (
            <button 
              id={tool + '-btn'} 
              key={tool}
              name={tool}
              className='btn toolbar-btn'
              onClick={() => selectTool(tool)}
            >
              {tool}
            </button>
          )
        })
      }
    </section>
  );
} 

export default Toolbar;