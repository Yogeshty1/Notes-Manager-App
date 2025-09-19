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
      console.log('API: Received response:', res.data);
      
      // Handle new backend response format
      if (res.data.success && res.data.data) {
        return res.data.data; // Return the notes array
      } else if (Array.isArray(res.data)) {
        return res.data; // Fallback for old format
      } else {
        throw new Error(res.data.message || 'Failed to fetch notes');
      }
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
      console.log('API: Created response:', res.data);
      
      // Handle new backend response format
      if (res.data.success && res.data.data) {
        return res.data.data; // Return the created note
      } else {
        throw new Error(res.data.message || 'Failed to create note');
      }
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
      console.log('API: Updated response:', res.data);
      
      // Handle new backend response format
      if (res.data.success && res.data.data) {
        return res.data.data; // Return the updated note
      } else {
        throw new Error(res.data.message || 'Failed to update note');
      }
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
      console.log('API: Deleted response:', res.data);
      
      // Handle new backend response format
      if (res.data.success) {
        return true; // Success
      } else {
        throw new Error(res.data.message || 'Failed to delete note');
      }
    } catch (error) {
      console.error('API: Error deleting note:', error);
      console.error('API: Error response:', error.response?.data);
      throw error;
    }
  }
};


