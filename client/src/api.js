import axios from 'axios';

// this talks to our server. the proxy in package.json will send /api to the backend
const http = axios.create({ headers: { 'Content-Type': 'application/json' } });

export const api = {
  // get all notes
  async listNotes() {
    try {
      const res = await http.get('/api/notes');
      return res.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },
  // add a new note
  async createNote(payload) {
    try {
      const res = await http.post('/api/notes', payload);
      return res.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },
  // update an existing note
  async updateNote(id, payload) {
    try {
      const res = await http.put(`/api/notes/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },
  // remove a note
  async deleteNote(id) {
    try {
      await http.delete(`/api/notes/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
};


