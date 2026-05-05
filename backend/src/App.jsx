import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import PostDetail from './pages/PostDetail';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

const AuthenticatedView = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/welcome" />;
  
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (savedTheme === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
      }
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <AuthenticatedView>
              <Home />
            </AuthenticatedView>
          } />

          <Route path="/profile/:username" element={
            <AuthenticatedView>
              <Profile />
            </AuthenticatedView>
          } />
          <Route path="/explore" element={
            <AuthenticatedView>
              <Explore />
            </AuthenticatedView>
          } />
          <Route path="/saved" element={
            <AuthenticatedView>
              <Saved />
            </AuthenticatedView>
          } />

          <Route path="/notifications" element={
            <AuthenticatedView>
              <Notifications />
            </AuthenticatedView>
          } />
          <Route path="/messages" element={
            <AuthenticatedView>
              <Messages />
            </AuthenticatedView>
          } />
          <Route path="/messages/:userId" element={
            <AuthenticatedView>
              <Messages />
            </AuthenticatedView>
          } />

          <Route path="/settings" element={
            <AuthenticatedView>
              <Settings />
            </AuthenticatedView>
          } />
          <Route path="/post/:id" element={
            <AuthenticatedView>
              <PostDetail />
            </AuthenticatedView>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
