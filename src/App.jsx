import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventDashboard from './components/EventDashboard';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/event/:eventID" element={<EventDashboard />} />
      </Routes>
    </div>
  );
}

export default App;