import React, { useState, useEffect } from 'react';
import { db } from '../store/db';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', cpf: '', birthDate: '', phone: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    setPatients(db.getPatients());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    db.savePatient(formData);
    setPatients(db.getPatients());
    setShowModal(false);
    setFormData({ name: '', cpf: '', birthDate: '', phone: '', email: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      db.deletePatient(id);
      setPatients(db.getPatients());
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Pacientes</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Novo Paciente
        </button>
      </div>

      <div className="table-container glass">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data de Nascimento</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum paciente cadastrado.</td></tr>
            ) : patients.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>{p.cpf}</td>
                <td>{p.birthDate}</td>
                <td>{p.phone}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => navigate(`/prontuario/${p.id}`)} title="Prontuário">
                      <FileText size={16} />
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => { setFormData(p); setShowModal(true); }} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--accent-red)' }} onClick={() => handleDelete(p.id)} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--modal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '2rem' }}>
            <h2>{formData.id ? 'Editar Paciente' : 'Novo Paciente'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="João da Silva" />
              </div>
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label>CPF</label>
                  <input required value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} placeholder="000.000.000-00" />
                </div>
                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input required type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label>Telefone</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(00) 00000-0000" />
                </div>
                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="joao@email.com" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); setFormData({ name: '', cpf: '', birthDate: '', phone: '', email: '' }); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
