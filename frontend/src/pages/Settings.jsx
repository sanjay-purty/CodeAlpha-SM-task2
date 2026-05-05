import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { 
  User, Shield, Bell, Moon, LogOut, 
  Trash2, Key, Globe, EyeOff 
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Profile Form State
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });

  useEffect(() => {
    // Apply theme on component mount/update
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (currentTheme) => {
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (currentTheme === 'light') {
      document.body.classList.remove('dark-theme');
    } else {
      // System
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await API.put('/users/profile', formData);
      await refreshUser();
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to update', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="settings-section animate-fade-in">
            <h2>Edit Profile</h2>
            <p className="section-desc">Update your personal information and how others see you.</p>
            
            {message.text && (
              <div className={`alert ${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="settings-form">
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange} 
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input 
                  type="url" 
                  name="website" 
                  value={formData.website} 
                  onChange={handleInputChange} 
                />
              </div>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        );
      
      case 'account':
        return (
          <div className="settings-section animate-fade-in">
            <h2>Account Settings</h2>
            <p className="section-desc">Manage your account security and login methods.</p>
            
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <Key size={20} />
                  <div>
                    <h4>Change Password</h4>
                    <span>Update your login password</span>
                  </div>
                </div>
                <button className="outline-btn">Update</button>
              </div>
              
              <div className="setting-item danger-zone">
                <div className="setting-info">
                  <Trash2 size={20} color="#ef4444" />
                  <div>
                    <h4 style={{color: '#ef4444'}}>Delete Account</h4>
                    <span>Permanently remove your account and data</span>
                  </div>
                </div>
                <button className="danger-btn">Delete</button>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-section animate-fade-in">
            <h2>Privacy & Safety</h2>
            <p className="section-desc">Control who can see your content and interact with you.</p>
            
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <EyeOff size={20} />
                  <div>
                    <h4>Private Account</h4>
                    <span>Only approved followers can see your posts</span>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <Globe size={20} />
                  <div>
                    <h4>Search Engine Visibility</h4>
                    <span>Allow search engines to index your profile</span>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section animate-fade-in">
            <h2>Notifications</h2>
            <p className="section-desc">Choose what you want to be notified about.</p>
            
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div>
                    <h4>Push Notifications</h4>
                    <span>Receive alerts on your device</span>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <div>
                    <h4>Email Notifications</h4>
                    <span>Receive summary emails</span>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-section appearance-tab animate-fade-in">
            <h2>Appearance</h2>
            <p className="section-desc">Customize the look and feel of MiniWorld.</p>
            
            <div className="appearance-group">
              <label>Theme</label>
              <div className="theme-visual-options">
                <div 
                  className={`theme-visual-card ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  <div className="theme-box light-box">
                    <div className="box-header"></div>
                    <div className="box-line short"></div>
                    <div className="box-line"></div>
                  </div>
                  <span>Light</span>
                </div>
                <div 
                  className={`theme-visual-card ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <div className="theme-box dark-box">
                    <div className="box-header"></div>
                    <div className="box-line short"></div>
                    <div className="box-line"></div>
                  </div>
                  <span>Dark</span>
                </div>
                <div 
                  className={`theme-visual-card ${theme === 'system' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('system')}
                >
                  <div className="theme-box system-box">
                    <div className="box-half left"></div>
                    <div className="box-half right"></div>
                  </div>
                  <span>System</span>
                </div>
              </div>
            </div>

            <div className="appearance-group">
              <label>Accent Color</label>
              <div className="accent-color-grid">
                {[
                  { name: 'Indigo', color: '#6366f1' },
                  { name: 'Pink', color: '#ec4899' },
                  { name: 'Green', color: '#10b981' },
                  { name: 'Amber', color: '#f59e0b' },
                  { name: 'Blue', color: '#3b82f6' },
                  { name: 'Red', color: '#ef4444' }
                ].map(item => (
                  <div 
                    key={item.color} 
                    className={`accent-circle-wrapper ${localStorage.getItem('accentColor') === item.color ? 'selected' : ''}`}
                    onClick={() => {
                      document.documentElement.style.setProperty('--primary', item.color);
                      localStorage.setItem('accentColor', item.color);
                    }}
                    title={item.name}
                  >
                    <div className="accent-circle" style={{ backgroundColor: item.color }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="appearance-group">
              <label>Font Size</label>
              <div className="font-size-picker">
                <button className="fs-btn">A-</button>
                <button className="fs-btn active">Medium</button>
                <button className="fs-btn">A+</button>
              </div>
            </div>
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <div className="settings-layout">
      <div className="settings-sidebar glass-panel">
        <h3 className="sidebar-title">Settings</h3>
        <nav className="settings-nav">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Edit Profile
          </button>
          <button 
            className={activeTab === 'account' ? 'active' : ''} 
            onClick={() => setActiveTab('account')}
          >
            <Shield size={18} /> Account
          </button>
          <button 
            className={activeTab === 'privacy' ? 'active' : ''} 
            onClick={() => setActiveTab('privacy')}
          >
            <EyeOff size={18} /> Privacy
          </button>
          <button 
            className={activeTab === 'notifications' ? 'active' : ''} 
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            className={activeTab === 'appearance' ? 'active' : ''} 
            onClick={() => setActiveTab('appearance')}
          >
            <Moon size={18} /> Appearance
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} /> Log out
          </button>
        </div>
      </div>

      <div className="settings-content glass-panel">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;
