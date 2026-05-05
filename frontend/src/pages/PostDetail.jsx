import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import PostCard from '../components/PostCard';
import { ArrowLeft } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <div className="post-detail-view animate-fade-in">
      <div className="view-header glass-card">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h2>Post</h2>
      </div>
      
      <div className="post-detail-content">
        <PostCard post={post} onUpdate={fetchPost} />
      </div>
    </div>
  );
};

export default PostDetail;
