import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ActivitySquare, User, Shield, UserRound } from 'lucide-react';
import { db } from '../store/db';

export default function Login({ theme }) {
  const { login } = useAuth();
  
  // Create a default doctor if none exists for testing
  React.useEffect(() => {
    if (db.getDoctors().length === 0) {
      db.saveDoctor({ id: 'doc-1', name: 'Dr. Carlos', crm: '12345-SP', specialty: 'Clínico Geral', phone: '1199999999' });
    }
  }, []);

  const handleLogin = (role, extraData = {}) => {
    login({ role, ...extraData });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div className="glass-panel" style={{ width: '400px', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="logo" style={{ marginBottom: '1rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.8rem', fontWeight: 'bold' }}>
          <ActivitySquare size={36} />
          MediCare+
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', textAlign: 'center' }}>Selecione o seu perfil para acessar o sistema.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: '1rem', justifyContent: 'flex-start' }}
            onClick={() => handleLogin('ADMIN', { name: 'Administrador' })}
          >
            <Shield size={20} style={{ color: 'var(--accent-red)' }} />
            <span>Acesso Administrador</span>
          </button>
          
          <button 
            className="btn btn-outline" 
            style={{ padding: '1rem', justifyContent: 'flex-start' }}
            onClick={() => handleLogin('SECRETARY', { name: 'Recepção / Secretária' })}
          >
            <User size={20} style={{ color: 'var(--accent-green)' }} />
            <span>Acesso Recepção</span>
          </button>

          <div style={{ margin: '1rem 0', borderBottom: 'var(--glass-border)' }}></div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Acesso Médico (Exemplo)</p>
          
          {db.getDoctors().map(doc => (
            <button 
              key={doc.id}
              className="btn btn-outline" 
              style={{ padding: '1rem', justifyContent: 'flex-start' }}
              onClick={() => handleLogin('DOCTOR', { name: doc.name, doctorId: doc.id })}
            >
              <UserRound size={20} style={{ color: 'var(--accent-blue)' }} />
              <span>{doc.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
