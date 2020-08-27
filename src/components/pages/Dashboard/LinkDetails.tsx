import React, { useState, useRef, useEffect } from 'react';
import { GraphLink, GraphNode } from '../../../types';

import { ColorPicker } from '../../../components';

interface ILinkDetailsProps {
  link: GraphLink;
  linkIndex: Record<string, GraphLink>;
  graphId: number;
  saveLink: (graphId: number, link: GraphLink) => void;
  updateLink: (link: GraphLink) => void;
}

const LinkDetails: React.FC<ILinkDetailsProps> = ({ link, linkIndex, graphId, saveLink, updateLink }) => {
  const [color, setColor] = useState(link.style!.color!);
  const [notes, setNotes] = useState(link.notes);
  const [width, setWidth] = useState(link.style!.width!.toString());
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
    setNotes(nextLink.notes);
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

  /**
   * Reset the details panel state on link change
   */
  useEffect(() => {
    if (link.id !== originalLink.current.id) load(link);
  }, [link, load]);

  return (
    <form>
      {/* Name */}
      <h1>
        {(link.source as GraphNode).name}---
        {(link.target as GraphNode).name}
      </h1>

      {/* Style */}
      <section className='details-style'>
        <h2>Style</h2>
        {/* Size */}
        <div className='details-form-control'>
          <label htmlFor='width'>Width</label>
          <input 
            id='width'
            type="range" 
            min="1" 
            max="10" 
            value={width}
            onChange={onInputChange}
          />
          <span>{width}</span>
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

      {/* Undo changes button */}
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
