import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import EditProfileModal from '../components/EditProfileModal';
import { useAuth } from '../context/AuthContext';
import { Calendar, Grid, List, CheckCircle, MapPin, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, refreshUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'grid'
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/users/${username}`);
      setProfileUser(res.data);
      const currentUserId = currentUser?._id || currentUser?.id;
      setIsFollowing(res.data.followers?.some(f => (f._id || f) === currentUserId));
    } catch (err) {
      console.error(err);
    }
  };


  const fetchUserPosts = async () => {
    try {
      const res = await API.get(`/posts/user/${username}`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleFollow = async () => {
    try {
      await API.post(`/users/${profileUser._id}/follow`);
      setIsFollowing(!isFollowing);
      fetchProfile();
      refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  if (!profileUser) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-banner-wrapper">
        <img 
          src={profileUser.coverImage?.startsWith('http') 
            ? profileUser.coverImage 
            : `http://localhost:5001/${profileUser.coverImage || 'uploads/default-banner.jpg'}`} 
          alt="banner" 
          className="profile-banner" 
        />
      </div>

      <div className="profile-header-main glass-card">
        <div className="profile-top-row">
          <img src={profileUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" className="profile-avatar-large" />
          <div className="profile-actions">
            {isOwnProfile ? (
              <button 
                className="btn-secondary" 
                onClick={() => setShowEditModal(true)}
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            ) : (
              <button 
                className={`btn-follow ${isFollowing ? 'unfollow' : ''}`} 
                onClick={handleFollow}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        <div className="profile-info-section">
          <div className="profile-name-row">
            <h1>{profileUser.username}</h1>
            <CheckCircle size={20} className="verified-badge" fill="var(--primary)" color="white" />
          </div>
          
          <p className="profile-bio">{profileUser.bio || 'Living the dream ✨'}</p>
          
          <div className="profile-meta">
            <span><MapPin size={16} /> Global</span>
            <span><Calendar size={16} /> Joined {format(new Date(profileUser.createdAt), 'MMMM yyyy')}</span>
          </div>

          <div className="profile-stats-row">
            <span><strong>{posts.length}</strong> Posts</span>
            <span><strong>{profileUser.followers.length}</strong> Followers</span>
            <span><strong>{profileUser.following.length}</strong> Following</span>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal 
          user={profileUser} 
          onClose={() => setShowEditModal(false)} 
          onUpdate={(updatedUser) => {
            setProfileUser(updatedUser);
            refreshUser(); // Update global auth state
          }} 
        />
      )}


      <div className="profile-content-tabs">
        <div className="tab-controls">
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><List size={20} /> Feed</button>
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><Grid size={20} /> Grid</button>
        </div>

        {isOwnProfile && <CreatePost onPostCreated={handlePostCreated} />}

        <div className={`posts-container ${view}-view`}>
          {posts.map(post => (
            view === 'list' ? (
              <PostCard key={post._id} post={post} onUpdate={fetchUserPosts} />
            ) : (
              <div key={post._id} className="grid-post">
                {post.image ? <img src={post.image} alt="post" /> : <div className="text-post-placeholder">{post.content.substring(0, 50)}...</div>}
              </div>
            )
          ))}
          {posts.length === 0 && <p className="no-posts">No posts yet.</p>}
        </div>
      </div>
    </div>
  );
};


export default Profile;
