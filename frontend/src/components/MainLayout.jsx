import React from 'react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileNav from './MobileNav';
import CreatePost from './CreatePost';
import { X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="app-layout">
      <Sidebar onCreatePost={() => setShowModal(true)} />
      <div className="main-feed">
        {children}
      </div>
      <RightSidebar />
      <MobileNav onAddClick={() => setShowModal(true)} />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Post</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X /></button>
            </div>
            <CreatePost onPostCreated={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
