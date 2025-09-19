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
    console.log('Attempting to delete note with ID:', id);
    
    // Find the note to restore if needed
    const noteToRestore = notes.find(n => n._id === id);
    console.log('Note to delete:', noteToRestore);
    
    // Optimistic delete - remove from UI immediately
    setNotes((prev) => prev.filter((n) => n._id !== id));
    
    try {
      await api.deleteNote(id);
      console.log('Successfully deleted note:', id);
    } catch (err) {
      console.error('Failed to delete note:', err);
      // Restore note to UI on failure
      if (noteToRestore) {
        setNotes((prev) => [noteToRestore, ...prev]);
      }
      alert('Failed to delete note. Please try again.');
    }
  }

  const [openNote, setOpenNote] = useState(null);

  async function saveModal(updated) {
    console.log('Attempting to update note:', updated);
    try {
      const saved = await api.updateNote(updated._id, { title: updated.title, description: updated.description });
      console.log('Successfully updated note:', saved);
      onEdit(saved);
      setOpenNote(null);
    } catch (err) {
      console.error('Failed to update note:', err);
      alert('Failed to update note. Please try again.');
    }
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


