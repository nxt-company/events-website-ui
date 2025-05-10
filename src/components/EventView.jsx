import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EventView() {
  const { eventID } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventName = localStorage.getItem(`join_event_name_${eventID}`);
        const inviteCode = localStorage.getItem(`join_invite_code_${eventID}`);
        const username = localStorage.getItem(`join_username_${eventID}`);
        if (!eventName || !inviteCode || !username) {
          setError('Event details not found. Please join the event again.');
          return;
        }
        const res = await axios.post('/api/v1/join-event', {
          event_name: eventName,
          invite_code: inviteCode,
          username: username
        });
        setEventDetails(res.data.event);
      } catch (error) {
        setError(error.response?.data?.error || error.message);
      }
    };
    fetchEventDetails();
  }, [eventID]);

  return (
    <div className="container py-8">
      {eventDetails ? (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">{eventDetails.name}</h2>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Questions</h3>
            {eventDetails.questions && eventDetails.questions.length > 0 ? (
              <div className="space-y-4">
                {eventDetails.questions.map((question) => (
                  <div key={question.id} className="p-4 bg-gray-900 rounded">
                    <p><strong>Question:</strong> {question.text}</p>
                    <p><strong>Options:</strong> {question.options.join(', ')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No questions added</p>
            )}
          </div>
        </>
      ) : (
        <div className="p-4 bg-red-900 rounded text-red-200">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
    </div>
  );
}

export default EventView;