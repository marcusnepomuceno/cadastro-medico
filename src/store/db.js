export const db = {
  getPatients: () => JSON.parse(localStorage.getItem('patients') || '[]'),
  savePatient: (patient) => {
    const patients = db.getPatients();
    if (patient.id) {
      const index = patients.findIndex(p => p.id === patient.id);
      patients[index] = patient;
    } else {
      patient.id = Date.now().toString();
      patient.createdAt = new Date().toISOString();
      patients.push(patient);
    }
    localStorage.setItem('patients', JSON.stringify(patients));
    return patient;
  },
  deletePatient: (id) => {
    const patients = db.getPatients().filter(p => p.id !== id);
    localStorage.setItem('patients', JSON.stringify(patients));
  },
  getDoctors: () => JSON.parse(localStorage.getItem('doctors') || '[]'),
  saveDoctor: (doctor) => {
    const doctors = db.getDoctors();
    if (doctor.id) {
      const index = doctors.findIndex(d => d.id === doctor.id);
      doctors[index] = doctor;
    } else {
      doctor.id = Date.now().toString();
      doctor.createdAt = new Date().toISOString();
      doctors.push(doctor);
    }
    localStorage.setItem('doctors', JSON.stringify(doctors));
    return doctor;
  },
  deleteDoctor: (id) => {
    const doctors = db.getDoctors().filter(d => d.id !== id);
    localStorage.setItem('doctors', JSON.stringify(doctors));
  },
  getRecords: (patientId) => {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    return records.filter(r => r.patientId === patientId);
  },
  saveRecord: (record) => {
    const records = JSON.parse(localStorage.getItem('records') || '[]');
    record.id = Date.now().toString();
    if (!record.date) record.date = new Date().toISOString();
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));
    return record;
  },
  getAppointments: () => JSON.parse(localStorage.getItem('appointments') || '[]'),
  saveAppointment: (appointment) => {
    const appointments = db.getAppointments();
    if (appointment.id) {
      const index = appointments.findIndex(a => a.id === appointment.id);
      appointments[index] = appointment;
    } else {
      appointment.id = Date.now().toString();
      appointment.status = 'Agendado';
      appointments.push(appointment);
    }
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return appointment;
  },
  deleteAppointment: (id) => {
    const appointments = db.getAppointments().filter(a => a.id !== id);
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
};
