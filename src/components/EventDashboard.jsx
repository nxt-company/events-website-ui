import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EventDashboard() {
  const { eventID } = useParams();
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [response, setResponse] = useState(null);
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

  const handleSubmit = async (e) => {
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
      setResponse(res.data);
      // Reset form
      setText('');
      setOptions(['', '', '']);
      setCorrectAnswer(0);
      setShowQuestionForm(false);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="container py-8">
      {eventDetails ? (
        <>
          <h2 className="text-3xl font-bold text-white mb-4">{eventDetails.name}</h2>
          <div className="mb-6 p-4 bg-gray-900 rounded">
            <p><strong>Creator Code:</strong> {eventDetails.creator_code}</p>
          </div>
        </>
      ) : (
        <div className="mb-6 p-4 bg-red-900 rounded text-red-200">
          <p><strong>Error:</strong> {eventDetailsError}</p>
        </div>
      )}
      <div className="flex gap-4 mb-6">
        <button
          className="btn btn-primary"
          onClick={() => setShowQuestionForm(!showQuestionForm)}
        >
          {showQuestionForm ? 'Cancel' : 'Add Question'}
        </button>
        <button className="btn btn-primary" disabled>
          Invite User (Coming Soon)
        </button>
      </div>
      {showQuestionForm && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-white mb-4">Add Question</h3>
          <form onSubmit={handleSubmit}>
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
          {response && (
            <div className="response mt-4 p-4 bg-gray-900 rounded">
              <p><strong>Question ID:</strong> {response.question_id}</p>
              <p><strong>Event ID:</strong> {response.event_id}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EventDashboard;