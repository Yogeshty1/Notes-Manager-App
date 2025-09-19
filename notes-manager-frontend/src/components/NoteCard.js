import React from 'react';

// this shows a single note card. click opens it for editing elsewhere
export default function NoteCard({ note, onOpen, onDelete }) {
  return (
    <div className="note" onClick={() => onOpen(note)}>
      {note.title && <div className="note-title">{note.title}</div>}
      {note.description && <div className="note-text">{note.description}</div>}
      <div className="note-actions" onClick={(e) => e.stopPropagation()}>
        <button className="btn" onClick={() => onDelete(note._id)}>Delete</button>
      </div>
    </div>
  );
}


