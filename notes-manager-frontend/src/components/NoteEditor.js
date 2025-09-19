import React, { useState } from 'react';

// this lets you edit an existing note inside the modal
export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title || '');
  const [text, setText] = useState(note.description || '');

  function save() {
    onSave({ ...note, title, description: text });
  }

  return (
    <div className="editor" onMouseDown={(e) => {
      const tag = String(e.target.tagName || '').toLowerCase();
      if (tag !== 'input' && tag !== 'textarea' && tag !== 'button') {
        onCancel();
      }
    }}>
      <input
        className="editor-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        className="editor-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Take a note..."
      />
      <div className="editor-actions">
        <button className="btn" onClick={save}>Save</button>
      </div>
    </div>
  );
}


