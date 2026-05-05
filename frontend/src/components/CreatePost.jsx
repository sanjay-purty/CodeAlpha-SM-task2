import React, { useState } from 'react';
import { Image as ImageIcon, Video, FileText, BarChart2, Smile } from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const [showEmojis, setShowEmojis] = useState(false);
  const emojis = ['✨', '🔥', '❤️', '😂', '🚀', '🙌', '💯', '🌈'];

  const addEmoji = (emoji) => {
    setContent(content + emoji);
    setShowEmojis(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const res = await API.post('/posts', formData);
      setContent('');
      setImage(null);
      setPreview('');
      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      console.error('Post creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-hub">
      <div className="create-post-main">
        <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" className="hub-avatar" />
        <div className="create-post-input-section">
          <textarea 
            placeholder="What's on your mind?" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="1"
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          
          {preview && (
            <div className="preview-wrapper">
              <img src={preview} alt="preview" className="post-preview" />
              <button className="remove-preview" onClick={() => {setImage(null); setPreview('');}}>×</button>
            </div>
          )}
          
          <div className="create-post-actions-row">
            <div className="media-actions">
              <label className="action-icon-btn" title="Upload Image">
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                <ImageIcon size={20} color="var(--primary)" />
                <span>Image</span>
              </label>
              <button type="button" className="action-icon-btn" title="Add Video"><Video size={20} color="var(--primary)" /> <span>Video</span></button>
              <button type="button" className="action-icon-btn" title="Add GIF"><FileText size={20} color="var(--primary)" /> <span>GIF</span></button>
              <button type="button" className="action-icon-btn" title="Create Poll"><BarChart2 size={20} color="var(--primary)" /> <span>Poll</span></button>
              
              <div className="emoji-picker-container">
                <button 
                  type="button" 
                  className="action-icon-btn" 
                  onClick={() => setShowEmojis(!showEmojis)}
                  title="Insert Emoji"
                >
                  <Smile size={20} color="var(--primary)" /> 
                  <span>Emoji</span>
                </button>
                {showEmojis && (
                  <div className="emoji-popup glass-card">
                    {emojis.map(e => (
                      <span key={e} onClick={() => addEmoji(e)} className="emoji-item">{e}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button 
              className="btn-primary post-submit-btn" 
              onClick={handleCreatePost} 
              disabled={loading || (!content.trim() && !image)}
            >
              {loading ? '...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default CreatePost;
