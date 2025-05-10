import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventDashboard from './components/EventDashboard';
import EventView from './components/EventView';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/event/:eventID" element={<EventDashboard />} />
        <Route path="/event/view/:eventID" element={<EventView />} />
      </Routes>
    </div>
  );
}

export default App;