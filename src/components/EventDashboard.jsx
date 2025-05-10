import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EventDashboard() {
  const { eventID } = useParams();
  const [activeView, setActiveView] = useState('questions'); // questions, invite, results
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [inviteUsername, setInviteUsername] = useState('');
  const [questionResponse, setQuestionResponse] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventDetailsError, setEventDetailsError] = useState(null);

  // Fetch event details and results
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventName = localStorage.getItem(`event_name_${eventID}`);
        const creatorCode = localStorage.getItem(`creator_code_${eventID}`);
        if (!eventName || !creatorCode) {
          setEventDetailsError('Event details not found. Please access the event manually.');
          return;
        }
        // Fetch event details
        const eventRes = await axios.post('/api/v1/creator-access', {
          event_name: eventName,
          creator_code: creatorCode
        });
        setEventDetails(eventRes.data.event);
        // Fetch results
        const resultsRes = await axios.get(`/api/v1/events/${eventID}/results`, {
          params: { creator_code: creatorCode }
        });
        setResults(resultsRes.data.results);
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
        setCorrectAnswer(newQuestions.length - 1);
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
      setActiveView('questions');
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
      await axios.post(`/api/v1/events/${eventID}/invite`, {
        username: inviteUsername
      });
      // Update event details to reflect new invite
      const updatedDetails = await axios.post('/api/v1/creator-access', {
        event_name: localStorage.getItem(`event_name_${eventID}`),
        creator_code: localStorage.getItem(`creator_code_${eventID}`)
      });
      setEventDetails(updatedDetails.data.event);
      // Reset form
      setInviteUsername('');
      setActiveView('invite');
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  const handleDeleteInvite = async (inviteCode) => {
    setError(null);
    try {
      const creatorCode = localStorage.getItem(`creator_code_${eventID}`);
      await axios.delete(`/api/v1/events/${eventID}/invite/${inviteCode}`, {
        params: { creator_code: creatorCode }
      });
      // Update event details to reflect deleted invite
      const updatedDetails = await axios.post('/api/v1/creator-access', {
        event_name: localStorage.getItem(`event_name_${eventID}`),
        creator_code: creatorCode
      });
      setEventDetails(updatedDetails.data.event);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  const handleDeleteQuestion = async (questionID) => {
    setError(null);
    try {
      const creatorCode = localStorage.getItem(`creator_code_${eventID}`);
      await axios.delete(`/api/v1/events/${eventID}/questions/${questionID}`, {
        params: { creator_code: creatorCode }
      });
      // Update event details to reflect deleted question
      const updatedDetails = await axios.post('/api/v1/creator-access', {
        event_name: localStorage.getItem(`event_name_${eventID}`),
        creator_code: creatorCode
      });
      setEventDetails(updatedDetails.data.event);
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
                className={`btn btn-primary ${activeView === 'questions' ? 'bg-green-700' : ''}`}
                onClick={() => setActiveView('questions')}
              >
                Questions
              </button>
              <button
                className={`btn btn-primary ${activeView === 'invite' ? 'bg-green-700' : ''}`}
                onClick={() => setActiveView('invite')}
              >
                Invite User
              </button>
              <button
                className={`btn btn-primary ${activeView === 'results' ? 'bg-green-700' : ''}`}
                onClick={() => setActiveView('results')}
              >
                View Results
              </button>
            </div>
          </div>
          <div className="mb-6 p-4 bg-gray-900 rounded">
            <p><strong>Creator Code:</strong> {eventDetails.creator_code}</p>
          </div>
          {activeView === 'questions' && (
            <>
              {eventDetails.questions && eventDetails.questions.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {eventDetails.questions.map((question) => (
                    <div key={question.id} className="p-4 bg-gray-900 rounded flex justify-between items-start">
                      <div>
                        <p><strong>Question:</strong> {question.text}</p>
                        <p><strong>Options:</strong> {question.options.join(', ')}</p>
                        <p><strong>Correct Answer:</strong> Option {question.correct_answer + 1} ({question.options[question.correct_answer]})</p>
                      </div>
                      <button
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mb-6">No questions added</p>
              )}
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
            </>
          )}
          {activeView === 'invite' && (
            <>
              {eventDetails.invites && eventDetails.invites.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {eventDetails.invites.map((invite) => (
                    <div key={invite.invite_code} className="p-4 bg-gray-900 rounded flex justify-between items-start">
                      <div>
                        <p><strong>Username:</strong> {invite.username}</p>
                        <p><strong>Invite Code:</strong> {invite.invite_code}</p>
                        <p><strong>Invite URL:</strong> http://localhost:8080/join?code={invite.invite_code}</p>
                      </div>
                      <button
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleDeleteInvite(invite.invite_code)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mb-6">No users invited</p>
              )}
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
              </div>
            </>
          )}
          {activeView === 'results' && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-white mb-4">User Submissions</h3>
              {results && results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="p-3 text-white">Username</th>
                        <th className="p-3 text-white">Answers</th>
                        <th className="p-3 text-white">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => (
                        <tr key={result.username} className="border-t border-gray-700">
                          <td className="p-3 text-white">{result.username}</td>
                          <td className="p-3 text-white">
                            {result.answers.map((answer, index) => (
                              <div key={index} className="mb-2">
                                <p><strong>Q:</strong> {answer.question_text}</p>
                                <p><strong>Selected:</strong> Option {answer.selected_option + 1} ({answer.options[answer.selected_option]})</p>
                                <p><strong>Correct:</strong> Option {answer.correct_option + 1} ({answer.options[answer.correct_option]})</p>
                              </div>
                            ))}
                          </td>
                          <td className="p-3 text-white">{result.correct_answers}/{result.total_questions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No submissions</p>
              )}
              {error && (
                <div className="response mt-4 p-4 bg-red-900 rounded text-red-200">
                  <p><strong>Error:</strong> {error}</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mb-6 p-4 bg-red-900 rounded text-red-200">
          <p><strong>Error:</strong> {eventDetailsError}</p>
        </div>
      )}
    </div>
  );
}

export default EventDashboard;