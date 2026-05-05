import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Bookmark, Share, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import './PostCard.css';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const isLiked = post.likes.includes(user.id);
  const isOwner = post.user._id === user.id || post.user === user.id;
  const [isBookmarked, setIsBookmarked] = useState(user.bookmarks?.includes(post._id));

  const handleLike = async () => {
    try {
      await API.post(`/posts/${post._id}/like`);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${post._id}`);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async () => {
    try {
      await API.post(`/posts/${post._id}/bookmark`);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await API.post(`/posts/${post._id}/comment`, { content: comment });
      setComment('');
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="hub-post-card">
      <div className="post-layout">
        <Link to={`/profile/${post.user?.username || 'unknown'}`}>
          <img src={post.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" className="post-avatar" />
        </Link>
        <div className="post-main-content">
          <div className="post-header-hub">
            <div className="post-user-info-hub">
              <Link to={`/profile/${post.user?.username || 'unknown'}`} className="post-link">
                <span className="display-name">{post.user?.username || 'Unknown User'}</span>
                <span className="handle">@{post.user?.username || 'unknown'}</span>
              </Link>
              <span className="dot">·</span>
              <span className="time">{post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : 'just now'}</span>
            </div>
            <div className="more-menu-container">
              <button className="more-btn" onClick={() => setShowMore(!showMore)}>
                <MoreHorizontal size={18} />
              </button>
              {showMore && (
                <div className="more-dropdown glass-card">
                  <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/post/' + post._id); setShowMore(false); }}>
                    Copy Link
                  </button>
                  {isOwner && (
                    <button className="delete-option" onClick={handleDelete}>
                      Delete Post
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <Link to={`/post/${post._id}`} className="post-body-link">
            <div className="post-body">
              <p className="content-text">{post.content}</p>
              {post.image && <img src={post.image} alt="post" className="hub-post-image" />}
            </div>
          </Link>

          <div className="post-actions-hub">
            <button 
              className={`action-btn-hub like-btn ${isLiked ? 'active' : ''}`} 
              onClick={handleLike}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{post.likes?.length || ''}</span>
            </button>
            <button className="action-btn-hub comment-btn" onClick={() => setShowComments(!showComments)}>
              <MessageCircle size={18} />
              <span>{post.comments?.length || ''}</span>
            </button>
            <button className="action-btn-hub retweet-btn">
              <Repeat2 size={18} />
              <span>12</span>
            </button>
            <button 
              className={`action-btn-hub save-btn ${isBookmarked ? 'active' : ''}`} 
              onClick={handleBookmark}
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {showComments && (
            <div className="inline-comments">
              <div className="comment-input-row">
                <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" className="avatar-xs" />
                <form onSubmit={handleComment}>
                  <input 
                    placeholder="Post your reply" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </form>
              </div>
              <div className="comments-feed-mini">
                {post.comments?.map((c, i) => (
                  <div key={i} className="comment-hub-item">
                    <Link to={`/profile/${c.user?.username || 'unknown'}`}>
                      <img src={c.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" className="avatar-xs" />
                    </Link>
                    <div className="comment-hub-body">
                      <div className="comment-hub-header">
                        <Link to={`/profile/${c.user?.username || 'unknown'}`} className="post-link">
                          <span className="comment-user-name">{c.user?.username || 'Unknown User'}</span>
                          <span className="comment-handle">@{c.user?.username || 'unknown'}</span>
                        </Link>
                      </div>
                      <p>{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};


export default PostCard;

