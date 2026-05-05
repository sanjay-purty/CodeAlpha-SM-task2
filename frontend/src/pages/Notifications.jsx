import React, { useState, useEffect } from 'react';
import API from '../api';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, UserPlus, AtSign, Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (n) => {
    try {
      if (!n.isRead) {
        await API.put(`/notifications/${n._id}/read`);
      }
      if (n.type === 'follow') {
        navigate(`/profile/${n.sender.username}`);
      } else if (n.post) {
        navigate(`/explore`); // Or a specific post view if implemented
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={18} className="icon-like" fill="#ef4444" color="#ef4444" />;
      case 'comment': return <MessageCircle size={18} className="icon-comment" color="var(--primary)" />;
      case 'follow': return <UserPlus size={18} className="icon-follow" color="#10b981" />;
      case 'mention': return <AtSign size={18} className="icon-mention" color="#f59e0b" />;
      default: return <Bell size={18} color="var(--text-muted)" />;
    }
  };

  const getMessage = (n) => {
    switch (n.type) {
      case 'like': return 'liked your post';
      case 'comment': return `commented: "${n.content}"`;
      case 'follow': return 'started following you';
      case 'mention': return 'mentioned you in a post';
      default: return 'sent you a notification';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="notifications-page animate-fade-in">
      <div className="notifications-header glass-card">
        <h1>Notifications</h1>
        <button className="mark-read-btn" onClick={markAllAsRead}>
          <CheckCheck size={18} /> Mark all as read
        </button>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <Bell size={48} />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n._id} 
              className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(n)}
            >
              <div className="notif-icon-wrapper">
                {getIcon(n.type)}
              </div>
              <img src={n.sender?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" className="notif-avatar" />
              <div className="notif-content">
                <p>
                  <span className="notif-user">{n.sender?.username || 'Unknown User'}</span> {getMessage(n)}
                </p>
                <span className="notif-time">{n.createdAt ? formatDistanceToNow(new Date(n.createdAt)) : 'some time'} ago</span>
              </div>

              {!n.isRead && <div className="unread-dot" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
