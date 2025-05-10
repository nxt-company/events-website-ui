import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EventDashboard() {
  const { eventID } = useParams();
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [inviteUsername, setInviteUsername] = useState('');
  const [questionResponse, setQuestionResponse] = useState(null);
  const [inviteResponse, setInviteResponse] = useState(null);
  const [error, setError] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventDetailsError, setEventDetailsError] = useState(null);

  // Fetch event details using creator code stored in localStorage
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventName = localStorage.getItem(`event_name_${eventID}`);
        const creatorCode = localStorage.getItem(`creator_code_${eventID}`);
        if (!eventName || !creatorCode) {
          setEventDetailsError('Event details not found. Please access the event manually.');
          return;
        }
        const res = await axios.post('/api/v1/creator-access', {
          event_name: eventName,
          creator_code: creatorCode
        });
        setEventDetails(res.data.event);
      } catch (error) {
        setEventDetailsError(error.response?.data?.error || error.message);
      }
    };
    fetchEventDetails();
  }, [eventID]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctAnswer >= newOptions.length) {
        setCorrectAnswer(newOptions.length - 1);
      }
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Validate options
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('At least 2 non-empty options are required');
      return;
    }
    if (correctAnswer >= validOptions.length) {
      setError('Correct answer index is out of bounds');
      return;
    }

    try {
      const res = await axios.post(`/api/v1/events/${eventID}/questions`, {
        text,
        options: validOptions,
        correct_answer: correctAnswer
      });
      setQuestionResponse(res.data);
      // Update event details to reflect new question
      const updatedDetails = await axios.post('/api/v1/creator-access', {
        event_name: localStorage.getItem(`event_name_${eventID}`),
        creator_code: localStorage.getItem(`creator_code_${eventID}`)
      });
      setEventDetails(updatedDetails.data.event);
      // Reset form
      setText('');
      setOptions(['', '', '']);
      setCorrectAnswer(0);
      setShowQuestionForm(false);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!inviteUsername.trim()) {
      setError('Username is required');
      return;
    }

    try {
      const res = await axios.post(`/api/v1/events/${eventID}/invite`, {
        username: inviteUsername
      });
      setInviteResponse(res.data);
      // Update event details to reflect new invite
      const updatedDetails = await axios.post('/api/v1/creator-access', {
        event_name: localStorage.getItem(`event_name_${eventID}`),
        creator_code: localStorage.getItem(`creator_code_${eventID}`)
      });
      setEventDetails(updatedDetails.data.event);
      // Reset form
      setInviteUsername('');
      setShowInviteForm(false);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="container py-8">
      {eventDetails ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">{eventDetails.name}</h2>
            <div className="flex gap-4">
              <button
                className="btn btn-primary"
                onClick={() => setShowQuestionForm(!showQuestionForm)}
              >
                {showQuestionForm ? 'Cancel' : 'Add Question'}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowInviteForm(!showInviteForm)}
              >
                {showInviteForm ? 'Cancel' : 'Invite User'}
              </button>
            </div>
          </div>
          <div className="mb-6 p-4 bg-gray-900 rounded">
            <p><strong>Creator Code:</strong> {eventDetails.creator_code}</p>
          </div>
        </>
      ) : (
        <div className="mb-6 p-4 bg-red-900 rounded text-red-200">
          <p><strong>Error:</strong> {eventDetailsError}</p>
        </div>
      )}
      {showQuestionForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-2xl font-semibold text-white mb-4">Add Question</h3>
          <form onSubmit={handleQuestionSubmit}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter Question (e.g., What is 2+2?)"
              className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
            />
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 p-2 border border-gray-600 rounded bg-gray-900 text-white"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => removeOption(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <button
                type="button"
                className="p-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={addOption}
              >
                Add Option
              </button>
            )}
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(Number(e.target.value))}
              className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
            >
              {options.map((_, index) => (
                <option key={index} value={index}>Option {index + 1}</option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Question
            </button>
          </form>
          {error && (
            <div className="response mt-4 p-4 bg-red-900 rounded text-red-200">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          {questionResponse && (
            <div className="response mt-4 p-4 bg-gray-900 rounded">
              <p><strong>Question ID:</strong> {questionResponse.question_id}</p>
              <p><strong>Event ID:</strong> {questionResponse.event_id}</p>
            </div>
          )}
        </div>
      )}
      {showInviteForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-2xl font-semibold text-white mb-4">Invite User</h3>
          <form onSubmit={handleInviteSubmit}>
            <input
              type="text"
              value={inviteUsername}
              onChange={(e) => setInviteUsername(e.target.value)}
              placeholder="Enter Username (e.g., user1)"
              className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-900 text-white"
            />
            <button
              type="submit"
              className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Invite
            </button>
          </form>
          {error && (
            <div className="response mt-4 p-4 bg-red-900 rounded text-red-200">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          {inviteResponse && (
            <div className="response mt-4 p-4 bg-gray-900 rounded">
              <p><strong>Username:</strong> {inviteResponse.username}</p>
              <p><strong>Invite Code:</strong> {inviteResponse.invite_code}</p>
              <p><strong>Invite URL:</strong> {inviteResponse.invite_url}</p>
            </div>
          )}
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-white mb-4">Questions</h3>
        {eventDetails && eventDetails.questions && eventDetails.questions.length > 0 ? (
          <div className="space-y-4">
            {eventDetails.questions.map((question) => (
              <div key={question.id} className="p-4 bg-gray-900 rounded">
                <p><strong>Question:</strong> {question.text}</p>
                <p><strong>Options:</strong> {question.options.join(', ')}</p>
                <p><strong>Correct Answer:</strong> Option {question.correct_answer + 1} ({question.options[question.correct_answer]})</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No questions added</p>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-white mb-4">Invited Users</h3>
        {eventDetails && eventDetails.invites && eventDetails.invites.length > 0 ? (
          <div className="space-y-4">
            {eventDetails.invites.map((invite) => (
              <div key={invite.invite_code} className="p-4 bg-gray-900 rounded">
                <p><strong>Username:</strong> {invite.username}</p>
                <p><strong>Invite Code:</strong> {invite.invite_code}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No users invited</p>
        )}
      </div>
    </div>
  );
}

export default EventDashboard;