import React from 'react';
import './App.css';
import TopBar from './components/TopBar';
import NotesGrid from './components/NotesGrid';

// this puts the whole page together
export default function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <NotesGrid />
    </div>
  );
}


