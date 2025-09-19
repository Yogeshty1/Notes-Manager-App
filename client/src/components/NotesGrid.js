import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Composer from './Composer';
import NoteCard from './NoteCard';
import Modal from './Modal';
import NoteEditor from './NoteEditor';

// this shows the list of notes in a grid
export default function NotesGrid() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.listNotes()
      .then((data) => { 
        setNotes(data); 
        setLoading(false); 
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load notes:', err);
        setError('Failed to load notes');
        setLoading(false);
      });
  }, []);

  function onCreated(n) {
    setNotes((prev) => [n, ...prev]);
  }

  function onEdit(updated) {
    setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
  }

  async function onDelete(id) {
    try {
      await api.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Failed to delete note:', err);
      alert('Failed to delete note. Please try again.');
    }
  }

  const [openNote, setOpenNote] = useState(null);

  async function saveModal(updated) {
    const saved = await api.updateNote(updated._id, { title: updated.title, description: updated.description });
    onEdit(saved);
    setOpenNote(null);
  }

  return (
    <div className="content">
      <Composer onCreated={onCreated} />
      {loading ? (
        <div className="empty">Loading...</div>
      ) : error ? (
        <div className="empty" style={{color: '#ff6b6b'}}>{error}</div>
      ) : notes.length === 0 ? (
        <div className="empty">No notes yet</div>
      ) : (
        <div className="grid">
          {notes.map((n) => (
            <NoteCard key={n._id} note={n} onOpen={setOpenNote} onDelete={onDelete} />
          ))}
        </div>
      )}

      <Modal open={!!openNote} onClose={() => setOpenNote(null)}>
        {openNote && (
          <NoteEditor note={openNote} onSave={saveModal} onCancel={() => setOpenNote(null)} />
        )}
      </Modal>
    </div>
  );
}


