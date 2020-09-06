import React, { useState, useEffect, useRef, useCallback } from 'react';

import { GraphNode } from '../../../types';
import { ColorPicker, RangeSlider } from '../../../components';
import NotesSection from './NotesSection';


interface IDetailsProps {
  graphId: number;
  handleKeyboardShortcut: (shouldHandle: boolean) => void;
  node: GraphNode;
  nodeIndex: Record<string, GraphNode>;
  saveNode: (graphId: number, node: GraphNode) => void;
  updateNode: (node: GraphNode) => void;
}

const NodeDetails: React.FC<IDetailsProps> = ({ graphId, handleKeyboardShortcut, node, nodeIndex, updateNode, saveNode}) => {
  const [name, setName] = useState(node.name);
  const [isEditingName, setIsEditingName] = useState(!node.name);
  const [isEditingSize, setIsEditingSize] = useState(false);
  const [isGroup, setIsGroup] = useState(node.isGroup);
  const [size, setSize] = useState(node.val!.toString());
  const [color, setColor] = useState(node.color!);
  const [notes, setNotes] = useState(node.notes!);
  const originalNode = useRef<GraphNode>({...node});

  /**
   * Closes the size slider if user clicks outside of it
   */
  const closeSizeSliderOnClick = useCallback((e: MouseEvent) => {
    if (!(e.target as HTMLElement).className.includes('slider')) {
      setIsEditingSize(false);
    }
  }, [])

  /**
   * Creates a copy of the node's current state
   * @returns The copy of the node
   */
  const createNextNode = (): GraphNode => {
    let currentNode = nodeIndex[node.id!];
    return {...currentNode};
  }

  const handleInputReturnKey = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      switch (e.currentTarget.id) {
        case 'name':
          onNameBlur();
      }
    }
  };

  /**
   * Revert node back to original state when the panel was opened
   */
  const handleCancelClick = () => {
    load(originalNode.current);
    updateNode(originalNode.current);
    saveNode(graphId, originalNode.current);
  };

  /**
   * Compares the values of the current and original state of the node
   * @returns True if user has changed any of the values
   */
  const hasNewValues = (): boolean => {
    let original = originalNode.current;
    return (
      name !== original.name || 
      isGroup !== original.isGroup ||
      size !== original.val!.toString() || 
      color !== original.color || 
      notes !== original.notes
    );
  };
  
  const load = (nextNode: GraphNode) => {
    // Save the original values, except positioning, which is taken care of by d3
    originalNode.current = {...nextNode};
    removePositionProps(originalNode.current);
    setName(nextNode.name);
    setIsGroup(nextNode.isGroup);
    setIsEditingName(!nextNode.name);
    setIsEditingSize(false);
    setSize(nextNode.val!.toString());
    setColor(nextNode.color!);
    setNotes(nextNode.notes!);
  }

  const onColorChange = (nextColor: string) => {
    setColor(nextColor);
    let updatedNode = createNextNode();
    updatedNode.color = nextColor;
    saveNode(graphId, updatedNode);
    updateNode(updatedNode);
  }

  const toggleIsGroup = () => {
    let updatedNode = createNextNode();
    setIsGroup(!isGroup);
    updatedNode.isGroup = !isGroup;
    saveNode(graphId, updatedNode);
    updateNode(updatedNode);
  };

  const onNameBlur = () => {
    setIsEditingName(false);
    saveNode(graphId, createNextNode());
  };

  const onNotesBlur = () => {
    saveNode(graphId, createNextNode());
  }
  
  // TODO: refactor into useEffect
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let field = e.currentTarget.id;
    let value = e.currentTarget.value;
    // The next steps will mutate the node itself, a consequence of using d3
    let updatedNode = createNextNode();

    if (['name', 'notes'].includes(field)) {
      if (field === 'name') {
        setName(value);
        updatedNode.name = value;
      }
      else {
        setNotes(value);
        updatedNode.notes = value;
      }
    }
    // These changes will be saved to db immediately
    else if (['size'].includes(field)) {
      if (field === 'size') {
        setSize(value);
        updatedNode.val = parseInt(value);
      }
      saveNode(graphId, updatedNode);
    }
    // Update the view
    updateNode(updatedNode);
  };

  const removePositionProps = (node: GraphNode) => {
    delete node.x;
    delete node.y;
    delete node.fx;
    delete node.fy;
  }

  /**
   * Reset the details panel state on node change
   */
  useEffect(() => {
    if (node.id !== originalNode.current.id) load(node);
  }, [node, load]);
  
  useEffect(() => {
    isEditingSize ? document.addEventListener('click', closeSizeSliderOnClick) : document.removeEventListener('click', closeSizeSliderOnClick);
  }, [isEditingSize]);

  useEffect(() => {
    handleKeyboardShortcut(!isEditingName);
  }, [isEditingName]);

  return (
    <>
      <div className='details-node-icon-header'>
        <i className='fas fa-circle details-node-icon' style={{ color }} />
      </div>
      {/* Name */}
      <h1 className='details-node-header'>
        {
          (isEditingName)
            ? <>
                <label className='sr-only' htmlFor='name'>Name</label>
                <input 
                  className='name-input'
                  id='name'
                  type='text'
                  onKeyDown={handleInputReturnKey}
                  onBlur={onNameBlur}
                  value={name}
                  onChange={onInputChange}
                  autoFocus
                  autoComplete='off'
                />
              </>
            : <>
                {name || '...'}
                <button onClick={() => setIsEditingName(true)} className='edit-icon-btn'>
                  <i className='far fa-edit' />
                </button>
                
              </>
        }
      </h1>

      {/* Groups */}
      { node.groups!.length > 0
        &&  <p className='details-groups'>
              Member of:&ensp; 
              {
                node.groups!.map((group, i) => {
                  let name = (i === node.groups!.length - 1) ? nodeIndex[group].name : nodeIndex[group].name + ', '
                  return <span key={group}>{name}</span>
                })
              }
            </p>
      }

      <div className='details-button-row'>
        {/* Color picker button */}
        <div className='details-button-row-btn' title='Change color'>
          <ColorPicker value={color} onColorChange={onColorChange} />
        </div>
        {/* Size button */}
        <button className='details-button-row-btn' title='Change size' onClick={() => setIsEditingSize(!isEditingSize)}>
          <i className='fas fa-expand-alt details-button-row-btn-icon' style={{ color }}/>
        </button>
        {
          (isEditingSize)
          &&  <div className='size-slider-wrapper'>
                <div className='size-slider-label'>
                  <span>Size</span><span>{size}</span>
                </div>
                <RangeSlider 
                  color={color} 
                  id='size' 
                  label='Node size'
                  min={1} 
                  max={10}
                  onChange={onInputChange} 
                  onMouseUp={() => setIsEditingSize(false)}
                  value={size} 
                />
              </div>
        }
        {/* Group button */}
        <button className='details-button-row-btn' onClick={toggleIsGroup}>
          {
            (isGroup)
            ? <i className='fas fa-house-user details-button-row-btn-icon' style={{ color }}/>
            : <i className='fas fa-user' style={{ color }}/>
          }
        </button>
      </div>

      {/* Notes */}
      <NotesSection 
        onNotesBlur={onNotesBlur} 
        onChange={onInputChange} 
        notes={notes} 
        handleKeyboardShortcut={handleKeyboardShortcut}
      />

      {/* Undo button */}
      {(hasNewValues())
        &&  <button 
              id='details-undo-btn' 
              className='details-btn'
              onClick={handleCancelClick}
              style={{color, borderColor: color}}
              title='Undo changes'
            >
              <i className='fas fa-undo' />
            </button>
      }
    </>
  );
}

export default React.memo(NodeDetails,
  (prevProps, nextProps) => {
    let prevNode = prevProps.node;
    let nextNode = nextProps.node;
    return (
      prevNode.id === nextNode.id && 
      prevNode.groups!.length === nextNode.groups!.length &&
      prevNode.name === nextNode.name &&
      prevNode.notes === nextNode.notes
    );
  }
);
