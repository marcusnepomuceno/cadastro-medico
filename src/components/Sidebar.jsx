import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ActivitySquare, UserRound, Sun, Moon, CalendarClock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ theme, toggleTheme }) {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar glass" style={{ justifyContent: 'space-between' }}>
      <div>
        <div className="logo" style={{ marginBottom: '2rem' }}>
          <ActivitySquare size={32} />
          <span>MediCare+</span>
        </div>
        
        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Perfil ativo:</p>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--accent-blue)' }}>{user?.name}</p>
        </div>

        <nav className="nav-links">
          <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/agendamentos" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <CalendarClock size={20} />
            <span>Agendamentos</span>
          </NavLink>

          <NavLink to="/pacientes" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>{user?.role === 'DOCTOR' ? 'Meus Pacientes' : 'Pacientes'}</span>
          </NavLink>
          
          {user?.role !== 'SECRETARY' && user?.role !== 'DOCTOR' && (
            <NavLink to="/medicos" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              <UserRound size={20} />
              <span>Médicos</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={logout} 
          className="btn btn-outline" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-red)' }}
        >
          <LogOut size={18} /> Sair
        </button>

        <button 
          onClick={toggleTheme} 
          className="btn btn-outline" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
        >
          {theme === 'dark' ? (
            <><Sun size={18} /> Modo Claro</>
          ) : (
            <><Moon size={18} /> Modo Escuro</>
          )}
        </button>
      </div>
    </div>
  );
}
