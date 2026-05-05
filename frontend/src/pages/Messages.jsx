import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, Send, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './Messages.css';

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000); // Poll for new conversations
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserToChat(userId);
    } else {
      setActiveChatUser(null);
      setMessages([]);
    }
  }, [userId]);

  const fetchUserToChat = async (id) => {
    try {
      const res = await API.get(`/users/id/${id}`);
      setActiveChatUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user for chat', err);
    }
  };

  useEffect(() => {
    if (activeChatUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [activeChatUser]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const res = await API.get('/messages/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  const fetchMessages = async () => {
    if (!activeChatUser) return;
    try {
      const res = await API.get(`/messages/${activeChatUser._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await API.get(`/messages/search/users?q=${q}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Failed to search users', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;
    try {
      const res = await API.post(`/messages/${activeChatUser._id}`, { content: newMessage });
      setMessages([...messages, res.data]);
      setNewMessage('');
      fetchConversations(); // Update last message
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const selectUserToChat = (u) => {
    navigate(`/messages/${u._id}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getOtherParticipant = (conv) => {
    return conv.participants.find(p => p._id !== user.id);
  };

  return (
    <div className="messages-layout animate-fade-in">
      <div className="messages-sidebar glass-panel">
        <div className="messages-sidebar-header">
          <h2>Messages</h2>
          <div className="msg-search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="conversations-list">
          {searchQuery && searchResults.length > 0 && (
            <div className="search-results-list">
              <span className="section-label">Search Results</span>
              {searchResults.map(u => (
                <div key={u._id} className="conversation-item" onClick={() => selectUserToChat(u)}>
                  <img src={u?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" />
                  <div className="conv-info">
                    <span className="conv-name">{u.username}</span>
                    <span className="conv-handle">Start chatting</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!searchQuery && conversations.map(conv => {
            const otherUser = getOtherParticipant(conv);
            if (!otherUser) return null;
            const isUnread = conv.lastMessage?.isRead === false && conv.lastMessage?.sender !== user.id;
            return (
              <div 
                key={conv._id} 
                className={`conversation-item ${activeChatUser?._id === otherUser._id ? 'active' : ''} ${isUnread ? 'unread' : ''}`}
                onClick={() => selectUserToChat(otherUser)}
              >
                <img src={otherUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" />
                <div className="conv-info">
                  <div className="conv-name-row">
                    <span className="conv-name">{otherUser?.username || 'Unknown User'}</span>
                    {conv.lastMessage && (
                      <span className="conv-time">{formatDistanceToNow(new Date(conv.updatedAt))}</span>
                    )}
                  </div>
                  <span className="conv-last-msg">
                    {conv.lastMessage?.text || 'No messages yet'}
                  </span>
                </div>
                {isUnread && <div className="unread-dot"></div>}
              </div>
            );
          })}
          {!searchQuery && conversations.length === 0 && (
            <div className="no-conversations">
              <p>No conversations yet. Search for a user to start chatting!</p>
            </div>
          )}
        </div>
      </div>

      <div className="messages-main glass-panel">
        {activeChatUser ? (
          <>
            <div className="chat-header">
              <div className="chat-user-info">
                <img src={activeChatUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" />
                <div>
                  <span className="chat-name">{activeChatUser?.username || 'Unknown User'}</span>
                  <span className="chat-status">Online</span>
                </div>
              </div>
              <div className="chat-actions">
                <button className="icon-btn"><Phone size={20} /></button>
                <button className="icon-btn"><Video size={20} /></button>
                <button className="icon-btn"><Info size={20} /></button>
              </div>
            </div>

            <div className="chat-messages-container">
              {messages.map((msg, index) => {
                const isMe = msg.sender === user?.id;
                return (
                  <div key={msg._id} className={`message-bubble-wrapper ${isMe ? 'me' : 'them'}`}>
                    {!isMe && <img src={activeChatUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="avatar" className="msg-avatar" />}
                    <div className="message-bubble">
                      <p>{msg.content}</p>
                      <span className="msg-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <form onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="empty-chat-state">
            <div className="empty-chat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h2>Your Messages</h2>
            <p>Select a conversation or search for someone to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
