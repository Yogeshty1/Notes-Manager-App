import axios from 'axios';

// this talks to our server. in production, it will use the same domain as the frontend
// in development, the proxy in package.json will send /api to the backend
const http = axios.create({ 
  headers: { 'Content-Type': 'application/json' },
  // Use relative URLs so they work in both development and production
  baseURL: ''
});

export const api = {
  // get all notes
  async listNotes() {
    try {
      console.log('API: Fetching notes from /api/notes');
      const res = await http.get('/api/notes');
      console.log('API: Received notes:', res.data);
      return res.data;
    } catch (error) {
      console.error('API: Error fetching notes:', error);
      console.error('API: Error response:', error.response?.data);
      throw error;
    }
  },
  // add a new note
  async createNote(payload) {
    try {
      console.log('API: Creating note:', payload);
      const res = await http.post('/api/notes', payload);
      console.log('API: Created note:', res.data);
      return res.data;
    } catch (error) {
      console.error('API: Error creating note:', error);
      console.error('API: Error response:', error.response?.data);
      throw error;
    }
  },
  // update an existing note
  async updateNote(id, payload) {
    try {
      console.log('API: Updating note:', id, payload);
      const res = await http.put(`/api/notes/${id}`, payload);
      console.log('API: Updated note:', res.data);
      return res.data;
    } catch (error) {
      console.error('API: Error updating note:', error);
      console.error('API: Error response:', error.response?.data);
      throw error;
    }
  },
  // remove a note
  async deleteNote(id) {
    try {
      console.log('API: Deleting note:', id);
      const res = await http.delete(`/api/notes/${id}`);
      console.log('API: Deleted note response:', res.data);
      return true;
    } catch (error) {
      console.error('API: Error deleting note:', error);
      console.error('API: Error response:', error.response?.data);
      throw error;
    }
  }
};


