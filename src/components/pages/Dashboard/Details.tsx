import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../../../store/reducers';
import { updateNode, saveNode } from '../../../store/actions';
import { GraphNode } from '../../../types';

import './Details.css';


interface DetailsProps extends PropsFromRedux {
  node: GraphNode;
}

const Details: React.ForwardRefRenderFunction<HTMLDivElement, DetailsProps> = ({ graphId, node, nodeIndex, updateNode, saveNode}, ref) => {
  const [name, setName] = useState(node.name);
  const [isEditingName, setIsEditingName] = useState(!node.name);
  const [size, setSize] = useState(node.style!.size!.toString());
  const [color, setColor] = useState(node.style!.color);
  const [notes, setNotes] = useState(node.notes!);
  const originalNode = useRef<GraphNode>({...node, style: {...node.style}});

  const createNextNode = (): GraphNode => {
    // Get the node's current state from the index 
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
    saveNode(graphId as string, originalNode.current);
  };

  const hasNewValues = (): boolean => {
    let original = originalNode.current;
    return (
      name !== original.name || 
      size !== original.style!.size!.toString() || 
      color !== original.style!.color || 
      notes !== original.notes
    );
  };
  
  const load = (node: GraphNode) => {
    // Save the original values, except positioning, which is taken care of by d3
    originalNode.current = {...node, style: {...node.style}};
    removePositionProps(originalNode.current);
    setName(node.name);
    setIsEditingName(!node.name);
    setSize(node.style!.size!.toString());
    setColor(node.style!.color!);
    setNotes(node.notes!);
  }

  const onNameBlur = () => {
    setIsEditingName(false);
    let nextNode = createNextNode();
    saveNode(graphId as string, Object.assign(nextNode, { name }));
  };

  const onNotesBlur = () => {
    let nextNode = createNextNode();
    saveNode(graphId as string, Object.assign(nextNode, { notes }));
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
    else if (['size', 'color'].includes(field)) {
      if (field === 'size') {
        setSize(value);
        updatedNode.style!.size = parseInt(value);
      }
      else {
        setColor(value);
        updatedNode.style!.color = value;
      }
      // Save style changes to db immediately
      saveNode(graphId as string, updatedNode);
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
    <div ref={ref} className='details'>
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
            <input 
              id='color'
              type="color"
              value={color}
              onChange={onInputChange}
            />
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
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  graphId: state.graph.data.id,
  nodeIndex: state.graph.idToNode,
});

const mapDispatchToProps = {
  updateNode,
  saveNode,
};

const connector = connect(
  mapStateToProps, 
  mapDispatchToProps, 
  null,
  { forwardRef: true } 
);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(React.memo(
  React.forwardRef(Details), 
  (prevProps, nextProps) => { 
    let prevNode = prevProps.node as GraphNode;
    let nextNode = nextProps.node as GraphNode;
    return (
      prevNode.id === nextNode.id && 
      prevNode.groups!.length === nextNode.groups!.length &&
      prevNode.name === nextNode.name &&
      prevNode.notes === nextNode.notes
    )
  }
));
