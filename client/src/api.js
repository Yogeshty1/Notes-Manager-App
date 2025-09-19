import axios from 'axios';

// this talks to our server. the proxy in package.json will send /api to the backend
const http = axios.create({ headers: { 'Content-Type': 'application/json' } });

export const api = {
  // get all notes
  async listNotes() {
    const res = await http.get('/api/notes');
    return res.data;
  },
  // add a new note
  async createNote(payload) {
    const res = await http.post('/api/notes', payload);
    return res.data;
  },
  // update an existing note
  async updateNote(id, payload) {
    const res = await http.put(`/api/notes/${id}`, payload);
    return res.data;
  },
  // remove a note
  async deleteNote(id) {
    await http.delete(`/api/notes/${id}`);
    return true;
  }
};


