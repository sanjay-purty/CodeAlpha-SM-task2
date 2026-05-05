import React, { useState } from 'react';
import API from '../api';
import { X, Camera } from 'lucide-react';
import './EditProfileModal.css';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ bio: user?.bio || '' });
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [previews, setPreviews] = useState({
    avatar: user?.avatar || '',
    cover: user?.coverImage || ''
  });

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'avatar') setAvatar(file);
      else setCover(file);
      setPreviews({ ...previews, [type]: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('bio', formData.bio);
    if (avatar) data.append('avatar', avatar);
    if (cover) data.append('coverImage', cover);

    try {
      const res = await API.put('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content animate-fade-in">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button onClick={onClose} className="close-btn"><X /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="profile-edit-previews">
            <div className="cover-edit-preview">
              <img src={previews.cover} alt="cover" />
              <label className="edit-camera-btn cover-camera">
                <input type="file" onChange={(e) => handleFileChange(e, 'cover')} style={{ display: 'none' }} />
                <Camera size={20} />
              </label>
            </div>
            <div className="avatar-edit-preview">
              <img src={previews.avatar} alt="avatar" />
              <label className="edit-camera-btn avatar-camera">
                <input type="file" onChange={(e) => handleFileChange(e, 'avatar')} style={{ display: 'none' }} />
                <Camera size={20} />
              </label>
            </div>
          </div>

          <div className="form-group bio-group">
            <label>Bio</label>
            <textarea 
              value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell the world about yourself..."
              rows="3"
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};


export default EditProfileModal;
