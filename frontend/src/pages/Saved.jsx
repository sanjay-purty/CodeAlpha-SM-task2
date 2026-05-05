import React, { useState, useEffect } from 'react';
import API from '../api';
import PostCard from '../components/PostCard';
import { Search, Plus, Folder, Grid, List as ListIcon } from 'lucide-react';
import './Saved.css';

const Saved = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('collections'); // 'collections' or 'all'

  const collections = [
    { id: 1, name: 'All Posts', count: 120, image: 'https://picsum.photos/seed/all/400/400' },
    { id: 2, name: 'Travel', count: 16, image: 'https://picsum.photos/seed/travel/400/400' },
    { id: 3, name: 'Inspiration', count: 32, image: 'https://picsum.photos/seed/art/400/400' },
    { id: 4, name: 'Study', count: 22, image: 'https://picsum.photos/seed/study/400/400' },
  ];

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get('/users/me/bookmarks');
      setBookmarks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saved-view animate-fade-in">
      <div className="view-header glass-card">
        <div className="header-top">
          <h2>Saved</h2>
          <button className="icon-btn"><Plus size={20} /></button>
        </div>
        <div className="view-tabs">
          <button className={view === 'collections' ? 'active' : ''} onClick={() => setView('collections')}>Collections</button>
          <button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>All Posts</button>
        </div>
      </div>

      <div className="saved-content">
        {view === 'collections' ? (
          <div className="collections-grid">
            {collections.map(col => (
              <div key={col.id} className="collection-card glass-card" onClick={() => setView('all')}>
                <div className="collection-thumb">
                  <img src={col.image} alt={col.name} />
                </div>
                <div className="collection-info">
                  <h3>{col.name}</h3>
                  <span>{col.count} posts</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="saved-posts-feed">
            <div className="feed-header">
              <h3>All Bookmarks</h3>
              <button className="view-toggle" onClick={() => setView('collections')}>Back to Collections</button>
            </div>
            {bookmarks.map(post => (
              <PostCard key={post._id} post={post} onUpdate={fetchBookmarks} />
            ))}
            {bookmarks.length === 0 && (
              <div className="empty-state">
                <Folder size={48} />
                <p>No bookmarks yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
