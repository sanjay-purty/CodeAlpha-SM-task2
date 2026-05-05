import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import './RightSidebar.css';

const RightSidebar = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await API.get('/users/suggested');
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (id) => {
    try {
      await API.post(`/users/${id}/follow`);
      refreshUser();
      fetchSuggestions();
    } catch (err) {
      console.error(err);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const trends = [
    { tag: '#MiniWorld', count: '1.2M Posts' },
    { tag: '#Photography', count: '85K Posts' },
    { tag: '#TechLife', count: '42K Posts' },
  ];

  return (
    <div className="sidebar-right">
      <div className="sidebar-top-section">
        <div className="search-bar-container">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/explore?q=${searchQuery}`);
                }
              }}
            />
          </div>
        </div>

        <div className="trending-pills">
          <span className="pill">#AI</span>
          <span className="pill">#Photography</span>
          <span className="pill">#Travel</span>
          <span className="pill">#News</span>
        </div>
      </div>

      <div className="card profile-card">
        <div className="card-header">Profile</div>
        <div className="profile-banner-mini">
          <img src={user?.coverImage?.startsWith('http') 
            ? user?.coverImage 
            : `http://localhost:5001/${user?.coverImage || 'uploads/default-banner.jpg'}`} 
            alt="banner" 
          />
        </div>
        <div className="profile-content">
          <img src={user?.avatar} alt="avatar" className="profile-avatar-mini" />
          <div className="profile-info-mini">
            <span className="profile-name-mini">{user?.username}</span>
            <span className="profile-handle-mini">@{user?.username}</span>
          </div>
          <p className="profile-bio-mini">{user?.bio || 'No bio yet ✨'}</p>
          <div className="profile-stats-mini">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user?.followers?.length || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user?.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
          <button 
            className="btn-secondary edit-profile-btn-mini"
            onClick={() => navigate(`/profile/${user?.username}`)}
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="card side-card">
        <div className="card-header">Who to follow</div>
        <div className="card-list">
          {suggestions.map((s) => (
            <div key={s._id} className="list-item">
              <Link to={`/profile/${s.username || 'unknown'}`}>
                <img src={s.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" />
              </Link>
              <Link to={`/profile/${s.username || 'unknown'}`} className="item-info">
                <span className="item-name">{s.username || 'Unknown User'}</span>
                <span className="item-handle">@{s.username || 'unknown'}</span>
              </Link>
              <button 
                className="btn-follow-mini"
                onClick={() => handleFollow(s._id)}
              >
                Follow
              </button>
            </div>
          ))}
        </div>

        <button className="card-footer-btn">View more</button>
      </div>

      <div className="card side-card">
        <div className="card-header">Trending</div>
        <div className="card-list">
          {trends.map((t) => (
            <div key={t.tag} className="list-item trend-item">
              <div className="item-info">
                <span className="item-name">{t.tag}</span>
                <span className="item-handle">{t.count}</span>
              </div>
              <MoreHorizontal size={16} />
            </div>
          ))}
        </div>
        <button className="card-footer-btn">View more</button>
      </div>
    </div>
  );
};

export default RightSidebar;

