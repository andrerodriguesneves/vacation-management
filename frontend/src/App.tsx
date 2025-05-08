import React from 'react';
import { Register } from './pages/Register';
import { AuthCallback } from './pages/AuthCallback';
import { UserManagement } from './pages/UserManagement';
import { Departments } from './pages/admin/Departments';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/departments" element={<Departments />} />
      </Routes>
    </Router>
  );
}

export default App;
