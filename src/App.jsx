import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import MedicalRecord from './pages/MedicalRecord';
import Appointments from './pages/Appointments';
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (!user) {
    return <Login theme={theme} />;
  }

  return (
    <div className="app-container">
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<Patients />} />
          <Route path="/medicos" element={user.role !== 'SECRETARY' && user.role !== 'DOCTOR' ? <Doctors /> : <Dashboard />} />
          <Route path="/agendamentos" element={<Appointments />} />
          <Route path="/prontuario/:id" element={<MedicalRecord />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
