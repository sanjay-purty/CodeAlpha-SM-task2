import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, User, LogOut, PlusSquare } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav className="navbar glass-card">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Mini<span>World</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" title="Home"><Home size={24} /></Link>
          <Link to={`/profile/${user.username}`} title="Profile"><User size={24} /></Link>
          <button onClick={() => { logout(); navigate('/login'); }} title="Logout">
            <LogOut size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
