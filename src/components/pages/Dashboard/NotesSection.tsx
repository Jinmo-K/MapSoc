import React, { useState, useRef } from 'react';

interface INotesSectionProps {
  handleKeyboardShortcut: (shouldHandle: boolean) => void;
  onNotesBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  notes: string;
}

const NotesSection: React.FC<INotesSectionProps> = ({ handleKeyboardShortcut, onNotesBlur, onChange, notes }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleEditNotesClick = () => {
    setIsEditingNotes(true);
    handleKeyboardShortcut(false);
    ref.current!.disabled = false;
    ref.current!.focus();
  }

  const onBlur = () => {
    setIsEditingNotes(false);
    handleKeyboardShortcut(true);
    ref.current!.disabled = true;
    onNotesBlur();
  }

  return (
    <section className='details-notes'>
      <h2>
        Notes
        {
          !(isEditingNotes) 
          &&  <button onClick={handleEditNotesClick} className='edit-icon-btn'>
                <i className='far fa-edit' />
              </button>
        }
      </h2>
      <textarea 
        ref={ref}
        id='notes'
        onBlur={onBlur}
        onChange={onChange}
        value={notes}
        spellCheck={false}
        disabled={true}
      />
    </section>
  );
};

export default NotesSection;
