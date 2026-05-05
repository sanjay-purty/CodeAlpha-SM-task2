import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <div className="welcome-content animate-fade-in">
        <div className="planet-container">
          <div className="planet">
            <div className="ring"></div>
          </div>
        </div>
        
        <h1 className="logo-title">MINI WORLD</h1>
        <p className="logo-subtitle">Connect. Share. Explore.</p>
        
        <div className="welcome-footer">
          <button 
            className="get-started-btn" 
            onClick={() => navigate('/onboarding')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
