import React, { useState, useEffect } from 'react';
import { db } from '../store/db';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', crm: '', specialty: '', phone: '' });

  useEffect(() => {
    setDoctors(db.getDoctors());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    db.saveDoctor(formData);
    setDoctors(db.getDoctors());
    setShowModal(false);
    setFormData({ name: '', crm: '', specialty: '', phone: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este médico?')) {
      db.deleteDoctor(id);
      setDoctors(db.getDoctors());
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Médicos</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Novo Médico
        </button>
      </div>

      <div className="table-container glass">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CRM</th>
              <th>Especialidade</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum médico cadastrado.</td></tr>
            ) : doctors.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 500 }}>{d.name}</td>
                <td>{d.crm}</td>
                <td><span style={{ background: 'rgba(59,130,246,0.2)', color: 'var(--accent-blue)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 500 }}>{d.specialty}</span></td>
                <td>{d.phone}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => { setFormData(d); setShowModal(true); }} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--accent-red)' }} onClick={() => handleDelete(d.id)} title="Excluir">
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
            <h2>{formData.id ? 'Editar Médico' : 'Novo Médico'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Dr. Carlos" />
              </div>
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label>CRM</label>
                  <input required value={formData.crm} onChange={e => setFormData({...formData, crm: e.target.value})} placeholder="12345-SP" />
                </div>
                <div className="form-group">
                  <label>Especialidade</label>
                  <select required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} style={{ background: 'var(--bg-dark)' }}>
                    <option value="">Selecione...</option>
                    <option value="Clínico Geral">Clínico Geral</option>
                    <option value="Cardiologia">Cardiologia</option>
                    <option value="Dermatologia">Dermatologia</option>
                    <option value="Pediatria">Pediatria</option>
                    <option value="Ortopedia">Ortopedia</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(00) 00000-0000" />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); setFormData({ name: '', crm: '', specialty: '', phone: '' }); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
