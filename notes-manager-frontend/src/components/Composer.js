import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api';

// this lets you type a new note and save it
export default function Composer({ onCreated }) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const boxRef = useRef(null);

  const canSubmit = title.trim().length > 0 || text.trim().length > 0;

  async function submit() {
    if (!canSubmit) return;
    
    // Store the form data before clearing
    const noteData = { title, description: text };
    
    // Clear form immediately
    setTitle('');
    setText('');
    setExpanded(false);
    
    // Save to server
    try {
      const created = await api.createNote(noteData);
      // Only call onCreated once with the real data from server
      onCreated(created);
    } catch (error) {
      console.error('Failed to save note:', error);
      // Restore form data on error
      setTitle(noteData.title);
      setText(noteData.description);
      setExpanded(true);
      alert('Failed to save note. Please try again.');
    }
  }

  // if we click outside the box, it will minimize
  useEffect(() => {
    function handleClickOutside(e) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) {
        setExpanded(false);
      }
    }
    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  return (
    <div ref={boxRef} className="composer" onClick={() => setExpanded(true)}>
      {expanded && (
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      )}
      <textarea
        placeholder="Take a note..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={expanded ? 3 : 1}
      />
      {expanded && (
        <div className="composer-actions">
          <button className="btn" onClick={submit} disabled={!canSubmit}>Save</button>
        </div>
      )}
    </div>
  );
}


