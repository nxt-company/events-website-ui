import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateEventModal from './CreateEventModal';
import AccessEventModal from './AccessEventModal';

function Navbar() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isEventDashboard = location.pathname.startsWith('/event/');

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="logo">Events App</div>
          <div className="nav-buttons">
            {!isEventDashboard ? (
              <>
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
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Exit
              </button>
            )}
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