import React, { useState } from 'react';

import { DashboardTool } from './Dashboard';

import './Toolbar.css';

interface IToolbarProps {
  selectTool: (tool: DashboardTool) => void;
  currentTool: DashboardTool;
}

const tools: DashboardTool[] = [
  'Select',
  'Draw',
  'Erase',
  'Area select',
];

const icons: Record<DashboardTool, JSX.Element> = {
  'Select': <i className='fas fa-mouse-pointer' />,
  'Draw': <i className='fas fa-pencil-alt' />,
  'Erase': <i className='fas fa-eraser' />,
  'Area select': <i className='fas fa-vector-square' />
}

const Toolbar: React.SFC<IToolbarProps> = ({ currentTool, selectTool }) => {
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
                selectTool(tool);
              }}
              title={tool + ` (${tool.charAt(0)})`}
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
