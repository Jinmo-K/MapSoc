import React, { useState, useRef, useEffect } from 'react';
import { GraphLink, GraphNode } from '../../../types';

import { ColorPicker, RangeSlider } from '../../../components';
import NotesSection from './NotesSection';

interface ILinkDetailsProps {
  link: GraphLink;
  linkIndex: Record<string, GraphLink>;
  graphId: number;
  saveLink: (graphId: number, link: GraphLink) => void;
  updateLink: (link: GraphLink) => void;
}

const LinkDetails: React.FC<ILinkDetailsProps> = ({ link, linkIndex, graphId, saveLink, updateLink }) => {
  const [color, setColor] = useState(link.style!.color!);
  const [notes, setNotes] = useState(link.notes || '');
  const [width, setWidth] = useState(link.style!.width!.toString());
  const [isEditingWidth, setIsEditingWidth] = useState(false);
  const originalLink = useRef<GraphLink>({ ...link, style: {...link.style} });

  /**
   * Creates a copy of the link's current state
   * @returns The copy of the link
   */
  const createNextLink = (): GraphLink => {
    let currentLink = linkIndex[link.id!];
    return {...currentLink, style: {...currentLink.style!}};
  }
  
  const handleCancelClick = () => {
    load(originalLink.current);
    updateLink(originalLink.current);
    saveLink(graphId, originalLink.current);
  };

  const hasNewValues = (): boolean => {
    let original = originalLink.current;
    return (
      width !== original.style!.width!.toString() || 
      color !== original.style!.color || 
      notes !== original.notes
    );
  };

  const load = (nextLink: GraphLink) => {
    originalLink.current = {...nextLink, style: {...nextLink.style}};
    setColor(nextLink.style!.color!);
    setNotes(nextLink.notes!);
    setWidth(nextLink.style!.width!.toString());
  };

  const onColorChange = (nextColor: string) => {
    let updatedLink = createNextLink();
    setColor(nextColor);
    updatedLink.style!.color = nextColor;
    saveLink(graphId, updatedLink);
    updateLink(updatedLink);
  };

  const onNotesBlur = () => {
    saveLink(graphId, link);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let field = e.currentTarget.id;
    let value = e.currentTarget.value;
    const updatedLink = createNextLink();

    if (['width'].includes(field)) {
      if (field === 'width') {
        setWidth(value);
        updatedLink.style!.width = parseInt(value);
      }
      saveLink(graphId, updatedLink);
    }
    else if (field === 'notes') {
      setNotes(value);
      updatedLink.notes = value;
    }
    // Render the change
    updateLink(updatedLink);
  };

  const renderNodeName = (node: GraphNode) => {
    let nodeColor = node.style!.color;
    return (
      <div className='details-link-header-node'>
        <i 
          className={node.isGroup ? 'fas fa-house-user details-link-header-node-icon' : 'fas fa-user details-link-header-node-icon'}
          style={{ color: nodeColor  }}
        />
        <span>{node.name}</span>
      </div>
    );
  };

  /**
   * Reset the details panel state when user clicks a different link
   */
  useEffect(() => {
    if (link.id !== originalLink.current.id) load(link);
  }, [link, load]);

  return (
    <>
      {/* Name */}
      <h1 className='details-link-header'>
        {renderNodeName(link.source as GraphNode)}
        <div 
          className='details-link-header-link-icon'
          style={{
            background: color,
            width: parseInt(width)
          }}
        />
        {renderNodeName(link.target as GraphNode)}
      </h1>

      <div className='details-button-row'>
        {/* Color picker button */}
        <div className='details-button-row-btn' title='Change color'>
          <ColorPicker value={color} onColorChange={onColorChange} />
        </div>
        {/* Width button */}
        <button className='details-button-row-btn' title='Change width' onClick={() => setIsEditingWidth(!isEditingWidth)}>
          <i className='fas fa-expand-alt details-button-row-btn-icon' style={{ color }}/>
        </button>
        {
          (isEditingWidth)
          &&  <div className='size-slider-wrapper'>
                <div className='size-slider-label'>
                  <span>Width</span><span>{width}</span>
                </div>
                <RangeSlider 
                  color={color} 
                  id='width' 
                  min={1} 
                  max={10}
                  onChange={onInputChange} 
                  onMouseUp={() => setIsEditingWidth(false)}
                  value={width} 
                />
              </div>
        }
      </div>

      {/* Notes */}
      <NotesSection onNotesBlur={onNotesBlur} onChange={onInputChange} notes={notes} />

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
  )
};

export default React.memo(LinkDetails,
  (prevProps, nextProps) => {
    let prevLink = prevProps.link;
    let nextLink = nextProps.link;
    return (
      prevLink.id === nextLink.id && 
      prevLink.notes === nextLink.notes && 
      prevLink.source === nextLink.source &&
      prevLink.target === nextLink.target 
    );
  }
);
