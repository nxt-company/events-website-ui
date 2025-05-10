import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateEventModal({ onClose }) {
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState('QA');
  const [creatorUsername, setCreatorUsername] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const res = await axios.get('/api/v1/event-types');
        setEventTypes(res.data);
      } catch (error) {
        setError(error.response?.data?.error || error.message);
      }
    };
    fetchEventTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('/api/v1/events', {
        name,
        type: eventType,
        creator_username: creatorUsername
      });
      setResponse(res.data);
      // Store event name and creator code in localStorage
      localStorage.setItem(`event_name_${res.data.event_id}`, name);
      localStorage.setItem(`creator_code_${res.data.event_id}`, res.data.creator_code);
      onClose(); // Close the modal
      navigate(`/event/${res.data.event_id}`); // Redirect to event dashboard
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Event</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Event Name (e.g., My Q&A)"
            className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
          />
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="text"
            value={creatorUsername}
            onChange={(e) => setCreatorUsername(e.target.value)}
            placeholder="Enter Creator Username (e.g., admin)"
            className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
          />
          <button
            type="submit"
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create
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
            <p><strong>Event ID:</strong> {response.event_id}</p>
            <p><strong>Creator Code:</strong> {response.creator_code}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateEventModal;