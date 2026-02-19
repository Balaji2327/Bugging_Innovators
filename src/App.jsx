import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';



import ProblemList from './pages/ProblemList';
import Workspace from './pages/Workspace';
import Interview from './pages/Interview';
import AITutor from './pages/AITutor';
import DSAConcepts from './pages/DSAConcepts';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="problems" element={<ProblemList />} />
          <Route path="workspace/:slug" element={<Workspace />} />
          <Route path="interview" element={<Interview />} />
          <Route path="ai-tutor" element={<AITutor />} />
          <Route path="dsa" element={<DSAConcepts />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
