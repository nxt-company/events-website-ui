import React from 'react';
import Card from './common/Card';

function Hero() {
  return (
    <main className="hero">
      <div className="container">
        <Card className="text-center p-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Create and Manage Your Events
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Build memorable events with ease. Create interactive Q&As, polls, and surveys.
            Invite participants and track responses in real-time.
          </p>
        </Card>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Q&A Sessions</h3>
              <p className="text-gray-600">
                Host interactive Q&A sessions with real-time responses and moderation.
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Live Polls</h3>
              <p className="text-gray-600">
                Create engaging polls and get instant feedback from your audience.
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Surveys</h3>
              <p className="text-gray-600">
                Design comprehensive surveys with multiple question types.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default Hero;