import React, { useState, useEffect } from 'react';
import { db } from '../store/db';
import { Plus, Edit2, Trash2, CalendarClock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ patientId: '', doctorId: '', date: '', time: '', status: 'Agendado' });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    let apps = db.getAppointments();
    // Se for médico, ver apenas sua agenda
    if (user.role === 'DOCTOR') {
      apps = apps.filter(a => a.doctorId === user.doctorId);
    }
    setAppointments(apps.sort((a,b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)));
    setPatients(db.getPatients());
    setDoctors(db.getDoctors());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    db.saveAppointment(formData);
    loadData();
    setShowModal(false);
    setFormData({ patientId: '', doctorId: '', date: '', time: '', status: 'Agendado' });
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      db.deleteAppointment(id);
      loadData();
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Realizado': return { bg: 'rgba(16, 185, 129, 0.2)', text: 'var(--accent-green)' };
      case 'Cancelado': return { bg: 'rgba(239, 68, 68, 0.2)', text: 'var(--accent-red)' };
      default: return { bg: 'rgba(59, 130, 246, 0.2)', text: 'var(--accent-blue)' };
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Agendamentos</h1>
        {user.role !== 'DOCTOR' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Novo Agendamento
          </button>
        )}
      </div>

      <div className="table-container glass">
        <table>
          <thead>
            <tr>
              <th>Data e Hora</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum agendamento encontrado.</td></tr>
            ) : appointments.map(a => {
              const patient = patients.find(p => p.id === a.patientId);
              const doctor = doctors.find(d => d.id === a.doctorId);
              const sColor = getStatusColor(a.status);
              
              return (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{new Date(`${a.date}T${a.time}`).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{patient ? patient.name : 'Desconhecido'}</td>
                  <td>{doctor ? doctor.name : 'Desconhecido'}</td>
                  <td>
                    <span style={{ background: sColor.bg, color: sColor.text, padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 500 }}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => { setFormData(a); setShowModal(true); }} title="Editar">
                        <Edit2 size={16} />
                      </button>
                      {user.role !== 'DOCTOR' && (
                        <button className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--accent-red)' }} onClick={() => handleDelete(a.id)} title="Excluir">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--modal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '2rem' }}>
            <h2>{formData.id ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Paciente</label>
                <select required disabled={user.role === 'DOCTOR'} value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})} style={{ background: 'var(--bg-dark)' }}>
                  <option value="">Selecione o paciente...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name} - {p.cpf}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Médico</label>
                <select required disabled={user.role === 'DOCTOR'} value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})} style={{ background: 'var(--bg-dark)' }}>
                  <option value="">Selecione o médico...</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label>Data</label>
                  <input type="date" required disabled={user.role === 'DOCTOR'} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <input type="time" required disabled={user.role === 'DOCTOR'} value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ background: 'var(--bg-dark)' }}>
                  <option value="Agendado">Agendado</option>
                  <option value="Realizado">Realizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); setFormData({ patientId: '', doctorId: '', date: '', time: '', status: 'Agendado' }); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
