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
    const created = await api.createNote({ title, description: text });
    onCreated(created);
    setTitle('');
    setText('');
    setExpanded(false);
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


