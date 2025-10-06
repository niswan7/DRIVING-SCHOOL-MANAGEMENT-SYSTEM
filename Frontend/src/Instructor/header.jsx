import React from 'react';
import { Car, LogOut } from 'lucide-react';
import'./style.css'

const Header = ({ instructorName }) => {
  const handleLogout = () => {
    alert('Logging out...');
    window.location.href = '/login'; 
  };

  return (
    <header className="header">
      <div className="logo">
        <Car size={32} />
        <span>DriveEasy</span>
      </div>
      <div className="header-right">
        <div className="header-profile">
          <p className="profile-text">Welcome, {instructorName || 'Instructor'}</p>
          <img src="/placeholder-avatar.jpg" alt="Profile" className="profile-avatar" />
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
