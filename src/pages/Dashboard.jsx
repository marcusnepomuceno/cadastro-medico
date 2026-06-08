import React, { useEffect, useState } from 'react';
import { Users, UserRound, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../store/db';

export default function Dashboard() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, records: 0 });

  useEffect(() => {
    const patients = db.getPatients();
    const doctors = db.getDoctors();
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    setStats({
      patients: patients.length,
      doctors: doctors.length,
      records: records.length
    });
  }, []);

  return (
    <div className="animate-fade-in">
      <h1>Dashboard</h1>
      <p style={{ marginBottom: '2rem' }}>Bem-vindo ao Sistema de Gestão de Clínica Médica.</p>
      
      <div className="grid grid-cols-3">
        <div className="glass stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Pacientes</h3>
            <p>{stats.patients}</p>
          </div>
        </div>
        
        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}>
            <UserRound size={24} />
          </div>
          <div className="stat-info">
            <h3>Médicos</h3>
            <p>{stats.doctors}</p>
          </div>
        </div>
        
        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Prontuários Atendidos</h3>
            <p>{stats.records}</p>
          </div>
        </div>
      </div>
      
      <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem' }}>
        <h2>Atalhos Rápidos</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/pacientes" className="btn btn-primary">Novo Paciente</Link>
          <Link to="/medicos" className="btn btn-outline">Cadastrar Médico</Link>
        </div>
      </div>
    </div>
  );
}
