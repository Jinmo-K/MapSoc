import React, { useState, useEffect } from 'react';
import { GraphNode } from '../../../types';

import './Details.css';


interface DetailsProps {
  node: GraphNode;
}

const Details: React.ForwardRefRenderFunction<HTMLDivElement, DetailsProps> = ({ node }, ref) => {
  const [name, setName] = useState(node.name);
  const [isEditingName, setIsEditingName] = useState(!node.name);
  const [size, setSize] = useState(node.style!.size!.toString());
  const [color, setColor] = useState(node.style!.color);
  const [notes, setNotes] = useState(node.notes!);

  const handleInputReturnKey = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      switch (e.currentTarget.id) {
        case 'name':
          onNameBlur();
      }
    }
  };
  
  const handleCancelClick = () => {
    reset();
  };

  const handleSaveClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const hasNewValues = (): boolean => {
    return (
      name !== node.name || 
      size !== node.style!.size!.toString() || 
      color !== node.style!.color || 
      notes !== node.notes
    );

  }

  const onNameBlur = () => {
    setIsEditingName(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let field = e.currentTarget.id;
    let value = e.currentTarget.value;

    switch(field) {
      case 'name':
        setName(value);
        break;
      case 'notes':
        setNotes(value);
        break;
      case 'size':
        setSize(value);
        break;
      case 'color':
        setColor(value);
        break;
      default:
    }
  };

  const reset = () => {
    setName(node.name!);
    setIsEditingName(!node.name);
    setSize(node.style!.size!.toString());
    setColor(node.style!.color!);
    setNotes(node.notes!);
  };

  /**
   * Reset the details panel state on node change
   */
  useEffect(() => {
    reset();
  }, [node]);
  
  return (
    <div ref={ref} className='details'>
      <form onSubmit={handleSaveClick} noValidate>
        <h1>
          {
            (isEditingName)
              ? <>
                  <label className='sr-only' htmlFor='name'>Name</label>
                  <input 
                    id='name'
                    type='text'
                    onKeyDown={handleInputReturnKey}
                    onBlur={onNameBlur}
                    value={name}
                    onChange={onInputChange}
                    autoFocus
                  />
                </>
              : <>
                  {name}
                  {name 
                    && <button onClick={() => setIsEditingName(true)}>edit</button>
                  }
                </>
          }
        </h1>
        <section className='details-style'>
          <h2>Style</h2>
          {/* Size */}
          <div className='details-form-control'>
            <label htmlFor='size'>Size</label>
            <input 
              id='size'
              type="range" 
              min="1" 
              max="10" 
              value={size}
              onChange={onInputChange}
            />
            <span>{size}</span>
          </div>
          {/* Colour */}
          <div className='details-form-control'>
            <label htmlFor='color'>Color</label>
            <input 
              id='color'
              type="color"
              value={color}
              onChange={onInputChange}
            />
          </div>
        </section>
        <section className='details-notes'>
          <h2>Notes</h2>
          <textarea 
            id='notes'
            rows={17}
            onChange={onInputChange}
            value={notes}
          />
        </section>

        {/* Save / cancel buttons */}
        {(hasNewValues())
          &&  <div id='details-update-btns'>
                <button 
                  id='details-save-btn' 
                  className='details-btn'
                  type='submit'
                >
                    SAVE
                </button>
                <button 
                  id='details-cancel-btn' 
                  className='details-btn'
                  onClick={handleCancelClick}
                >
                  CANCEL
                </button>
              </div>
        }
      </form>
    </div>
  )
}

export default React.memo(
  React.forwardRef(Details), 
  (prevProps, nextProps) => { 
    let prevNode = prevProps.node as GraphNode;
    let nextNode = nextProps.node as GraphNode;
    return (
      prevNode.id === nextNode.id && prevNode.name === nextNode.name
    )
  }
);