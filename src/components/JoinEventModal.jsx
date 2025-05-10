import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function JoinEventModal({ onClose }) {
  const [eventName, setEventName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [username, setUsername] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('/api/v1/join-event', {
        event_name: eventName,
        invite_code: inviteCode,
        username: username
      });
      setResponse(res.data.event);
      // Store event name, invite code, and username in localStorage
      localStorage.setItem(`join_event_name_${res.data.event.id}`, eventName);
      localStorage.setItem(`join_invite_code_${res.data.event.id}`, inviteCode);
      localStorage.setItem(`join_username_${res.data.event.id}`, username);
      onClose(); // Close the modal
      navigate(`/event/view/${res.data.event.id}`); // Redirect to event view
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setError(errorMessage);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Join Event</h2>
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
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter Invite Code (e.g., uuid)"
            className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username (e.g., user1)"
            className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
          />
          <button
            type="submit"
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Join
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

export default JoinEventModal;