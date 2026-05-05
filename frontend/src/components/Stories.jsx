import React from 'react';
import './Stories.css';

const Stories = () => {
  const stories = [
    { id: 1, username: 'Your Story', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { id: 2, username: 'Ankit', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit' },
    { id: 3, username: 'Riya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riya' },
    { id: 4, username: 'Karan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan' },
    { id: 5, username: 'Priya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { id: 6, username: 'Rahul', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  ];

  return (
    <div className="stories-container glass-card">
      {stories.map(story => (
        <div key={story.id} className="story-item">
          <div className="story-avatar-wrapper">
            <img src={story.avatar} alt={story.username} className="story-avatar" />
          </div>
          <span className="story-username">{story.username}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
