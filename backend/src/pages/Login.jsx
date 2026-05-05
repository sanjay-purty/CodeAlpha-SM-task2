import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card animate-fade-in">
        <h1>Welcome Back!</h1>
        <p className="auth-subtitle">Login to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Username</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email" 
            />
          </div>
          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              <Link to="/forgot-password" title="Coming soon">Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="btn-primary login-btn">Login</button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-logins">
          <button className="social-btn google">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="google" />
            Continue with Google
          </button>
          <button className="social-btn apple">
            <img src="https://www.svgrepo.com/show/442911/apple.svg" alt="apple" />
            Continue with Apple
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>

  );
};

export default Login;
