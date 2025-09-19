import React from 'react';
import logo from '../logo.svg';

// this is the bar at the top with the app name and an icon
export default function TopBar() {
  return (
    <div className="topbar">
      <img src={logo} alt="Notes icon" className="brand-icon" />
      <div className="brand">Notes Manager App</div>
    </div>
  );
}


