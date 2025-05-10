import React, { useState } from 'react';
import axios from 'axios';

function CreateEventModal({ onClose }) {
  const [name, setName] = useState('');
  const [creatorUsername, setCreatorUsername] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/events', {
        name,
        creator_username: creatorUsername
      });
      setResponse(res.data);
    } catch (error) {
      alert('Error creating event: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Event</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event Name"
        />
        <input
          type="text"
          value={creatorUsername}
          onChange={(e) => setCreatorUsername(e.target.value)}
          placeholder="Creator Username"
        />
        <button onClick={handleSubmit}>Create</button>
        <button className="close" onClick={onClose}>Close</button>
        {response && (
          <div className="response">
            <p><strong>Event ID:</strong> {response.event_id}</p>
            <p><strong>Creator Code:</strong> {response.creator_code}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateEventModal;