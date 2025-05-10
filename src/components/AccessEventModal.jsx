import React, { useState } from 'react';
import axios from 'axios';

function AccessEventModal({ onClose }) {
  const [eventName, setEventName] = useState('');
  const [creatorCode, setCreatorCode] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const res = await axios.post('/api/v1/creator-access', {
        event_name: eventName,
        creator_code: creatorCode
      });
      setResponse(res.data.event);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setError(errorMessage);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Access Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter Event Name (e.g., My Q&A)"
            className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
          />
          <input
            type="text"
            value={creatorCode}
            onChange={(e) => setCreatorCode(e.target.value)}
            placeholder="Enter Creator Code (e.g., uuid)"
            className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
          />
          <button
            type="submit"
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Access
          </button>
          <button
            type="button"
            className="w-full p-2 mt-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </form>
        {error && (
          <div className="response mt-4 p-4 bg-red-900 rounded text-red-200">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        {response && (
          <div className="response mt-4 p-4 bg-gray-900 rounded">
            <p><strong>Event Name:</strong> {response.name}</p>
            <p><strong>Event ID:</strong> {response.id}</p>
            <p><strong>Event Type:</strong> {response.type}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccessEventModal;