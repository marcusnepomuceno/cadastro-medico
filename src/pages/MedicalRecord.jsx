import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../store/db';
import { ArrowLeft, Plus } from 'lucide-react';
import { cid10 } from '../data/cid';
import { useAuth } from '../contexts/AuthContext';

export default function MedicalRecord() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    anamnesis: '',
    physicalExam: '',
    cid: '',
    diagnosis: '',
    prescription: ''
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const patients = db.getPatients();
    const found = patients.find(p => p.id === id);
    setPatient(found);
    if (found) {
      setRecords(db.getRecords(id));
      setDoctors(db.getDoctors());
    }
  }, [id]);

  const openNewRecordModal = () => {
    const now = new Date();
    setFormData({
      doctorId: '',
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(':')[0] + ':' + now.toTimeString().split(':')[1],
      anamnesis: '',
      physicalExam: '',
      cid: '',
      diagnosis: '',
      prescription: ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datetime = new Date(`${formData.date}T${formData.time}`).toISOString();
    
    let diagnosisStr = formData.diagnosis;
    if (formData.cid) {
      const cidObj = cid10.find(c => c.code === formData.cid);
      const desc = cidObj ? cidObj.description : '';
      diagnosisStr = `[${formData.cid} - ${desc}]\n${formData.diagnosis}`;
    }
    
    db.saveRecord({
      patientId: id,
      doctorId: formData.doctorId,
      date: datetime,
      anamnesis: formData.anamnesis,
      physicalExam: formData.physicalExam,
      diagnosis: diagnosisStr,
      prescription: formData.prescription
    });
    
    setRecords(db.getRecords(id));
    setShowModal(false);
  };

  if (!patient) return <div className="animate-fade-in">Paciente não encontrado.</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => navigate('/pacientes')}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ margin: 0 }}>Prontuário Médico</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2>Dados do Paciente</h2>
        <div className="grid grid-cols-3" style={{ marginTop: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome</p>
            <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{patient.name}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CPF</p>
            <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{patient.cpf}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Data de Nascimento</p>
            <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{patient.birthDate}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Histórico de Consultas</h2>
        {user.role !== 'SECRETARY' && (
          <button className="btn btn-primary" onClick={openNewRecordModal}>
            <Plus size={18} /> Nova Consulta
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {records.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum registro encontrado para este paciente.</p>
        ) : records.sort((a,b) => new Date(b.date) - new Date(a.date)).map(r => {
            const doc = doctors.find(d => d.id === r.doctorId);
            return (
              <div key={r.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: 'var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>Data: {new Date(r.date).toLocaleDateString('pt-BR')} {new Date(r.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Médico: {doc ? doc.name : 'Desconhecido'}</span>
                </div>
                
                {user.role === 'SECRETARY' ? (
                  <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', borderRadius: 'var(--radius-sm)' }}>
                    Visualização restrita (Acesso Médico).
                  </div>
                ) : (
                  <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                    <div>
                      <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }}>Anamnese (Queixa principal)</h4>
                      <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{r.anamnesis}</p>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>Exame Físico</h4>
                      <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{r.physicalExam}</p>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--accent-red)', marginBottom: '0.5rem' }}>Diagnóstico</h4>
                      <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{r.diagnosis}</p>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Prescrição / Conduta</h4>
                      <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{r.prescription}</p>
                    </div>
                  </div>
                )}
              </div>
            );
        })}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--modal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '800px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h2>Nova Consulta</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              
              <div className="grid grid-cols-3">
                <div className="form-group">
                  <label>Médico Responsável</label>
                  <select required value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})} style={{ background: 'var(--bg-dark)' }}>
                    <option value="">Selecione...</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Data</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label>Anamnese / História Clínica</label>
                  <textarea required rows="4" value={formData.anamnesis} onChange={e => setFormData({...formData, anamnesis: e.target.value})} placeholder="Queixa principal e histórico..."></textarea>
                </div>
                <div className="form-group">
                  <label>Exame Físico</label>
                  <textarea required rows="4" value={formData.physicalExam} onChange={e => setFormData({...formData, physicalExam: e.target.value})} placeholder="Sinais vitais, observações..."></textarea>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label>CID-10 (Opcional)</label>
                  <input list="cid-options" value={formData.cid} onChange={e => setFormData({...formData, cid: e.target.value})} placeholder="Busque pelo código ou descrição..." />
                  <datalist id="cid-options">
                    {cid10.map(item => (
                      <option key={item.code} value={item.code}>{item.code} - {item.description}</option>
                    ))}
                  </datalist>
                  <label style={{marginTop: '0.5rem'}}>Descrição do Diagnóstico</label>
                  <textarea required rows="2" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} placeholder="Detalhes do diagnóstico..."></textarea>
                </div>
                <div className="form-group">
                  <label>Prescrição Médica e Conduta</label>
                  <textarea required rows="5" value={formData.prescription} onChange={e => setFormData({...formData, prescription: e.target.value})} placeholder="Medicamentos, exames, orientações..."></textarea>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-success">Salvar Prontuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
