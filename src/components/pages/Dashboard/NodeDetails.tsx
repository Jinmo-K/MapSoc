import React, { useState, useEffect, useRef } from 'react';

import { GraphNode } from '../../../types';
import { ColorPicker } from '../../../components';


interface IDetailsProps {
  graphId: number;
  node: GraphNode;
  nodeIndex: Record<string, GraphNode>;
  saveNode: (graphId: number, node: GraphNode) => void;
  updateNode: (node: GraphNode) => void;
}

const NodeDetails: React.FC<IDetailsProps> = ({ graphId, node, nodeIndex, updateNode, saveNode}) => {
  const [name, setName] = useState(node.name);
  const [isEditingName, setIsEditingName] = useState(!node.name);
  const [isGroup, setIsGroup] = useState(node.isGroup);
  const [size, setSize] = useState(node.style!.size!.toString());
  const [color, setColor] = useState(node.style!.color!);
  const [notes, setNotes] = useState(node.notes!);
  const originalNode = useRef<GraphNode>({...node, style: {...node.style}});

  /**
   * Creates a copy of the node's current state
   * @returns The copy of the node
   */
  const createNextNode = (): GraphNode => {
    let currentNode = nodeIndex[node.id!];
    return {...currentNode, style: {...currentNode.style!}};
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
      size !== original.style!.size!.toString() || 
      color !== original.style!.color || 
      notes !== original.notes
    );
  };
  
  const load = (nextNode: GraphNode) => {
    // Save the original values, except positioning, which is taken care of by d3
    originalNode.current = {...nextNode, style: {...nextNode.style}};
    removePositionProps(originalNode.current);
    setName(nextNode.name);
    setIsGroup(nextNode.isGroup);
    setIsEditingName(!nextNode.name);
    setSize(nextNode.style!.size!.toString());
    setColor(nextNode.style!.color!);
    setNotes(nextNode.notes!);
  }

  const onColorChange = (nextColor: string) => {
    setColor(nextColor);
    let updatedNode = createNextNode();
    updatedNode.style!.color = nextColor;
    saveNode(graphId, updatedNode);
    updateNode(updatedNode);
  }

  const onNameBlur = () => {
    setIsEditingName(false);
    saveNode(graphId, createNextNode());
  };

  const onNotesBlur = () => {
    saveNode(graphId, createNextNode());
  }
  
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
    else if (['size', 'isGroup'].includes(field)) {
      if (field === 'size') {
        setSize(value);
        updatedNode.style!.size = parseInt(value);
      }
      else if (field === 'isGroup') {
        setIsGroup(!isGroup);
        updatedNode.isGroup = !isGroup;
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
  
  return (
    <form>
      {/* Name */}
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

      {/* Is group */}
      <div className='details-form-control'>
          <label htmlFor='isGroup'>Group</label>
          <input 
            id='isGroup'
            type="checkbox" 
            checked={isGroup!}
            // value={isGroup ? 'on' : 'off'}
            onChange={onInputChange}
          />
          <span />
        </div>

      {/* Style */}
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
          <ColorPicker initialValue={color} onColorChange={onColorChange} />
        </div>
      </section>

      {/* Notes */}
      <section className='details-notes'>
        <h2>Notes</h2>
        <textarea 
          id='notes'
          rows={17}
          onBlur={onNotesBlur}
          onChange={onInputChange}
          value={notes}
        />
      </section>

      {/* Save / cancel buttons */}
      {(hasNewValues())
        &&  <div id='details-update-btns'>
              <button 
                id='details-undo-btn' 
                className='details-btn'
                onClick={handleCancelClick}
              >
                UNDO CHANGES
              </button>
            </div>
      }
    </form>
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
