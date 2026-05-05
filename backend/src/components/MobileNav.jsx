import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './MobileNav.css';

const MobileNav = ({ onAddClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className="mobile-nav glass-panel">
      <Link to="/" className={isActive('/') ? 'active' : ''}>
        <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
      </Link>
      <Link to="/explore" className={isActive('/explore') ? 'active' : ''}>
        <Search size={24} strokeWidth={isActive('/explore') ? 2.5 : 2} />
      </Link>
      <button className="mobile-add-btn" onClick={onAddClick}>
        <PlusSquare size={24} />
      </button>
      <Link to="/messages" className={isActive('/messages') ? 'active' : ''}>
        <Mail size={24} strokeWidth={isActive('/messages') ? 2.5 : 2} />
      </Link>
      <Link to={`/profile/${user?.username}`} className={isActive(`/profile/${user?.username}`) ? 'active' : ''}>
        <User size={24} strokeWidth={isActive(`/profile/${user?.username}`) ? 2.5 : 2} />
      </Link>
    </div>
  );
};

export default MobileNav;
