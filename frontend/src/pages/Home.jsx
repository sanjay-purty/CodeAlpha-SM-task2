import React, { useState, useEffect } from 'react';
import API from '../api';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import Stories from '../components/Stories';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="home-view animate-fade-in">
      <div className="view-header">
        <h2>Home</h2>
      </div>
      
      <Stories />
      
      <div className="create-post-container">
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      <div className="posts-feed">
        {posts.map(post => (
          <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
        ))}
      </div>
    </div>
  );
};


export default Home;
