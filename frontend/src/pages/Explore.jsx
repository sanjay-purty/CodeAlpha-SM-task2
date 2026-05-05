import React, { useState, useEffect } from 'react';
import API from '../api';
import PostCard from '../components/PostCard';
import { Search, Hash, TrendingUp, Users, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Trending');
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState({ posts: [], users: [] });

  const categories = ['Trending', 'Tech', 'Travel', 'Education', 'Entertainment'];
  const hashtags = ['#AI', '#Web3', '#Photography', '#Cooking', '#Fitness'];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
      setSearch(query);
      performSearch(query);
    } else {
      fetchExploreData();
    }
  }, [window.location.search]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      const postsRes = await API.get(`/posts/search?q=${query}`);
      const usersRes = await API.get(`/users/search/users?q=${query}`);
      setSearchResults({ posts: postsRes.data, users: usersRes.data });
      setPosts(postsRes.data);
      setSuggestedUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExploreData = async () => {
    try {
      const postsRes = await API.get('/posts/trending');
      const usersRes = await API.get('/users/suggested');
      setPosts(postsRes.data);
      setSuggestedUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(search.toLowerCase()) ||
    (post.user?.username || '').toLowerCase().includes(search.toLowerCase())
  );


  const isSearching = new URLSearchParams(window.location.search).get('q');

  return (
    <div className="explore-view animate-fade-in">
      <div className="explore-header glass-panel">
        <div className="search-container-hub">
          <Search size={20} className="search-icon" />
          <input 
            placeholder="Search MiniWorld..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = `/explore?q=${search}`;
              }
            }}
          />
        </div>
        
        {isSearching ? (
          <div className="search-results-header">
            <h3>Showing results for "{isSearching}"</h3>
            <button className="clear-search" onClick={() => window.location.href = '/explore'}>Clear</button>
          </div>
        ) : (
          <div className="category-scroll-wrapper">
            <div className="category-pills">
              {['All', 'Tech', 'Travel', 'Education', 'Art', 'Nature', 'News'].map(cat => (
                <button 
                  key={cat} 
                  className={`pill-btn ${activeTab === cat ? 'active' : ''}`} 
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="explore-layout">
        <div className="explore-main">
          {!isSearching && (
            <div className="trending-grid-section">
              <h3>Trending Posts</h3>
              <div className="trending-posts-grid">
                {[1,2,3,4].map(i => (
                  <div key={i} className="trending-grid-item">
                    <img src={`https://picsum.photos/seed/${i+10}/400/400`} alt="trending" />
                    <div className="grid-overlay">
                      <Zap size={14} />
                      <span>Trending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading">Discovering content...</div>
          ) : (
            <div className="posts-feed">
              <h3 className="section-title">{isSearching ? 'Search Results' : 'Recent Posts'}</h3>
              {filteredPosts.map(post => (
                <PostCard key={post._id} post={post} onUpdate={fetchExploreData} />
              ))}
            </div>
          )}
        </div>


        <div className="explore-side">
          <div className="explore-card">
            <div className="card-header-row">
              <TrendingUp size={18} color="var(--primary)" />
              <h3>Trending Hashtags</h3>
            </div>
            <div className="tag-list">
              {[
                { tag: '#Nature', category: 'Photography', count: '125K' },
                { tag: '#AI', category: 'Technology', count: '85K' },
                { tag: '#Web3', category: 'Crypto', count: '42K' },
                { tag: '#Travel', category: 'Lifestyle', count: '96K' },
              ].map(item => (
                <div key={item.tag} className="tag-item-premium">
                  <div className="tag-meta">Trending in {item.category}</div>
                  <div className="tag-name-row">
                    <span className="tag-hash">{item.tag}</span>
                  </div>
                  <div className="tag-count-meta">{item.count} posts</div>
                </div>
              ))}
            </div>

          </div>

          <div className="explore-card">
            <div className="card-header-row">
              <Users size={18} color="var(--primary)" />
              <h3>Who to follow</h3>
            </div>
            <div className="suggested-list-mini">
              {suggestedUsers.map(user => (
                <div key={user._id} className="suggested-item-mini">
                  <Link to={`/profile/${user.username}`}>
                    <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" />
                  </Link>
                  <Link to={`/profile/${user.username}`} className="suggested-info">
                    <span className="s-name">{user.username}</span>
                    <span className="s-handle">@{user.username}</span>
                  </Link>
                  <button className="btn-follow-mini">Follow</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
