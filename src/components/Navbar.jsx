import React, { useState } from 'react';
import CreateEventModal from './CreateEventModal.jsx';
import AccessEventModal from './AccessEventModal.jsx';

function Navbar() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="logo">Events App</div>
          <div className="nav-buttons">
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Create Event
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowAccessModal(true)}
            >
              Access Event
            </button>
          </div>
        </div>
      </header>
      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
      {showAccessModal && (
        <AccessEventModal onClose={() => setShowAccessModal(false)} />
      )}
    </>
  );
}

export default Navbar;