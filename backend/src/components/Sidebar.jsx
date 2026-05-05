import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Search, Bell, Mail, User, Bookmark, 
  Archive, Settings, Plus, MoreHorizontal 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import './Sidebar.css';

const Sidebar = ({ onCreatePost }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user, location.pathname]);

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get('/notifications');
      const unread = res.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to fetch notifications count', err);
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadCount > 0 ? unreadCount : null },
    { icon: Mail, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: `/profile/${user?.username}` },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="sidebar-left">
      <div className="logo-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <span className="logo-text">MiniWorld</span>
        </Link>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.label} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="icon-wrapper">
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && <span className="badge">{item.badge}</span>}
              </div>
              <span className="nav-label">{item.label}</span>
              {isActive && <div className="active-pill"></div>}
            </Link>
          );
        })}
      </nav>

      <button className="btn-primary create-post-btn" onClick={onCreatePost}>
        <Plus className="mobile-icon" size={24} />
        <span className="desktop-text">Create Post</span>
      </button>

      <div className="user-profile-mini" onClick={logout} title="Click to logout">
        <img src={user?.avatar} alt="avatar" className="mini-avatar" />
        <div className="user-details">
          <span className="user-name">{user?.username}</span>
          <span className="user-handle">@{user?.username}</span>
        </div>
        <MoreHorizontal className="more-icon" size={20} />
      </div>
    </div>
  );
};

export default Sidebar;
