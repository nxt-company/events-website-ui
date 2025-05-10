import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EventView() {
  const { eventID } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [answers, setAnswers] = useState({}); // Store selected options { question_id: selected_option }

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

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const username = localStorage.getItem(`join_username_${eventID}`);
      if (!username) {
        setError('Username not found. Please join the event again.');
        return;
      }
      const answerArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        question_id: questionId,
        selected_option: selectedOption
      }));
      const res = await axios.post(`/api/v1/events/${eventID}/submit-answers`, {
        username,
        answers: answerArray
      });
      setSuccess(res.data.message);
      setAnswers({}); // Clear answers after submission
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="container py-8">
      {eventDetails ? (
        <>
          <h2 className="text-3xl font-bold text-white mb-6">{eventDetails.name}</h2>
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Questions</h3>
            {eventDetails.questions && eventDetails.questions.length > 0 ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {eventDetails.questions.map((question) => (
                    <div key={question.id} className="p-4 bg-gray-900 rounded">
                      <p className="text-lg font-medium text-white mb-2"><strong>Question:</strong> {question.text}</p>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <label key={index} className="flex items-center space-x-2 text-white">
                            <input
                              type="radio"
                              name={`question_${question.id}`}
                              value={index}
                              checked={answers[question.id] === index}
                              onChange={() => handleOptionChange(question.id, index)}
                              className="form-radio text-green-600"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full p-2 mt-6 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit Answers
                </button>
              </form>
            ) : (
              <p className="text-gray-400">No questions added</p>
            )}
            {error && (
              <div className="response mt-4 p-4 bg-red-900 rounded text-red-200">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
            {success && (
              <div className="response mt-4 p-4 bg-gray-900 rounded text-white">
                <p><strong>Success:</strong> {success}</p>
              </div>
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