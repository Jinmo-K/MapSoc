import React from 'react';

import './ContextMenu.css';

export const ContextMenu = React.forwardRef(({ closeContextMenu }, ref) => {
  const onClick = () => {
    closeContextMenu();
  }
  

  return (
    <div ref={ref} id='context-menu'>
      {(false)
        ? 'specific node stuff'
        : <ul>
            <strong>Add new</strong>
          </ul>
      }
    </div>
  )
});
