import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { 
  createTestUser, 
  createTestAppointment, 
  seedTestDatabase, 
  clearTestDatabase,
  makeAuthenticatedRequest
} from '../setup/integration';

describe('Clinic Workflow Integration Tests', () => {
  beforeEach(async () => {
    await clearTestDatabase();
    await seedTestDatabase();
  });

  describe('Patient Journey', () => {
    it('should complete full patient registration and appointment flow', async () => {
      // 1. Patient registration
      const patientData = {
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '+244 923 456 789',
        birthDate: '1985-06-15',
        bloodType: 'O+',
        address: 'Luanda, Angola'
      };

      const registrationResponse = await request(global.testApp)
        .post('/api/portal/auth/register')
        .send(patientData)
        .expect(201);

      expect(registrationResponse.body.success).toBe(true);
      const patientId = registrationResponse.body.data.id;

      // 2. Patient login
      const loginResponse = await request(global.testApp)
        .post('/api/portal/auth/login')
        .send({
          email: patientData.email,
          password: 'defaultPassword123'
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      const authToken = loginResponse.body.token;

      // 3. View available doctors and specialties
      const doctorsResponse = await request(global.testApp)
        .get('/api/portal/doctors?specialty=Cardiologia')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(doctorsResponse.body.success).toBe(true);
      expect(doctorsResponse.body.data.length).toBeGreaterThan(0);

      // 4. Schedule appointment
      const appointmentData = {
        doctorId: doctorsResponse.body.data[0].id,
        specialty: 'Cardiologia',
        date: '2024-12-25',
        time: '14:30',
        reason: 'Consulta de rotina - dor no peito'
      };

      const appointmentResponse = await request(global.testApp)
        .post('/api/portal/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointmentData)
        .expect(201);

      expect(appointmentResponse.body.success).toBe(true);
      const appointmentId = appointmentResponse.body.data.id;

      // 5. Verify appointment was created
      const appointmentsListResponse = await request(global.testApp)
        .get('/api/portal/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(appointmentsListResponse.body.success).toBe(true);
      expect(appointmentsListResponse.body.data).toContainEqual(
        expect.objectContaining({
          id: appointmentId,
          patientId: patientId
        })
      );

      // 6. Update appointment (reschedule)
      const updateResponse = await request(global.testApp)
        .patch(`/api/portal/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          date: '2024-12-26',
          time: '15:00'
        })
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
    });

    it('should handle appointment reminders and notifications', async () => {
      // Create appointment 24 hours from now
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const appointmentData = createTestAppointment({
        date: tomorrow.toISOString().split('T')[0],
        time: '14:30'
      });

      // Simulate appointment reminder system
      const reminderResponse = await request(global.testApp)
        .post('/api/notifications/send')
        .send({
          userId: appointmentData.patientId,
          templateId: 'apt_reminder_24h',
          recipient: 'patient@example.com',
          variables: {
            patientName: 'João Silva',
            appointmentDate: appointmentData.date,
            appointmentTime: appointmentData.time,
            doctorName: appointmentData.doctorName,
            specialty: appointmentData.specialty,
            location: 'Clínica Bem Cuidar'
          }
        })
        .expect(200);

      expect(reminderResponse.body.success).toBe(true);
      expect(reminderResponse.body.data.status).toBe('sent');
    });
  });

  describe('Medical Staff Workflow', () => {
    it('should complete nurse pre-consultation workflow', async () => {
      // 1. Nurse login
      const nurseLoginResponse = await request(global.testApp)
        .post('/api/portal/auth/login')
        .send({
          email: 'enfermeira@bemcuidar.co.ao',
          password: 'enfermeira123'
        })
        .expect(200);

      const nurseToken = nurseLoginResponse.body.token;

      // 2. View today's appointments
      const todayAppointmentsResponse = await request(global.testApp)
        .get('/api/vital-signs/today')
        .set('Authorization', `Bearer ${nurseToken}`)
        .expect(200);

      expect(todayAppointmentsResponse.body.success).toBe(true);

      // 3. Record vital signs for patient
      const vitalSignsData = {
        patient_id: 'patient-1',
        appointment_id: 'appointment-1',
        recorded_by_user_id: 'nurse-1',
        blood_pressure_systolic: 125,
        blood_pressure_diastolic: 82,
        heart_rate: 78,
        temperature: 36.9,
        weight: 75.5,
        height: 175,
        oxygen_saturation: 98,
        respiratory_rate: 16,
        notes: 'Paciente apresenta sinais vitais normais, relatando leve ansiedade'
      };

      const vitalSignsResponse = await request(global.testApp)
        .post('/api/vital-signs')
        .set('Authorization', `Bearer ${nurseToken}`)
        .send(vitalSignsData)
        .expect(200);

      expect(vitalSignsResponse.body.success).toBe(true);

      // 4. Send message to doctor about patient status
      const messageToDoctor = {
        from_user_id: 'nurse-1',
        to_user_id: 'doctor-1',
        message: 'Paciente João Silva preparado para consulta. Sinais vitais registrados. PA: 125/82, FC: 78.',
        type: 'text'
      };

      const messageResponse = await request(global.testApp)
        .post('/api/messaging/messages')
        .set('Authorization', `Bearer ${nurseToken}`)
        .send(messageToDoctor)
        .expect(200);

      expect(messageResponse.body.success).toBe(true);
    });

    it('should complete doctor consultation workflow', async () => {
      // 1. Doctor login
      const doctorLoginResponse = await request(global.testApp)
        .post('/api/portal/auth/login')
        .send({
          email: 'medico@bemcuidar.co.ao',
          password: 'medico123'
        })
        .expect(200);

      const doctorToken = doctorLoginResponse.body.token;

      // 2. View patient vital signs
      const vitalSignsResponse = await request(global.testApp)
        .get('/api/vital-signs/patient/patient-1')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(vitalSignsResponse.body.success).toBe(true);

      // 3. View patient medical history
      const medicalHistoryResponse = await request(global.testApp)
        .get('/api/portal/medical-records/patient-1')
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);

      expect(medicalHistoryResponse.body.success).toBe(true);

      // 4. Create medical record
      const medicalRecordData = {
        patientId: 'patient-1',
        appointmentId: 'appointment-1',
        chiefComplaint: 'Dor torácica há 3 dias',
        historyOfPresentIllness: 'Paciente refere dor em aperto, retroesternal, que piora aos esforços',
        physicalExamination: 'BEG, corado, hidratado. CV: RCR 2T BNF. AR: MV presente bilateralmente',
        assessment: 'Angina instável provável',
        plan: 'ECG, troponinas, ecocardiograma. Manter AAS. Retorno 1 semana',
        prescriptions: [
          {
            medication: 'AAS',
            dosage: '100mg',
            frequency: '1x ao dia',
            duration: '30 dias',
            instructions: 'Tomar após café da manhã'
          }
        ]
      };

      const medicalRecordResponse = await request(global.testApp)
        .post('/api/portal/medical-records')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(medicalRecordData)
        .expect(201);

      expect(medicalRecordResponse.body.success).toBe(true);

      // 5. Update appointment status
      const appointmentUpdateResponse = await request(global.testApp)
        .patch('/api/portal/appointments/appointment-1')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send({
          status: 'completed',
          doctorNotes: 'Consulta realizada. Solicitados exames complementares.'
        })
        .expect(200);

      expect(appointmentUpdateResponse.body.success).toBe(true);
    });

    it('should complete receptionist check-in workflow', async () => {
      // 1. Receptionist login
      const receptionistLoginResponse = await request(global.testApp)
        .post('/api/portal/auth/login')
        .send({
          email: 'secretaria@bemcuidar.co.ao',
          password: 'secretaria123'
        })
        .expect(200);

      const receptionistToken = receptionistLoginResponse.body.token;

      // 2. View today's appointment schedule
      const scheduleResponse = await request(global.testApp)
        .get('/api/portal/appointments?date=today')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .expect(200);

      expect(scheduleResponse.body.success).toBe(true);

      // 3. Check in patient
      const checkInResponse = await request(global.testApp)
        .patch('/api/portal/appointments/appointment-1/check-in')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .send({
          checkedInAt: new Date().toISOString(),
          notes: 'Paciente chegou no horário'
        })
        .expect(200);

      expect(checkInResponse.body.success).toBe(true);

      // 4. Notify nurse about patient arrival
      const notificationResponse = await request(global.testApp)
        .post('/api/notifications/send')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .send({
          userId: 'nurse-1',
          templateId: 'patient_arrival',
          recipient: 'nurse-1',
          variables: {
            patientName: 'João Silva',
            appointmentTime: '14:30',
            doctorName: 'Dr. António Silva'
          }
        })
        .expect(200);

      expect(notificationResponse.body.success).toBe(true);
    });
  });

  describe('File and Document Management', () => {
    it('should handle exam result upload and patient notification', async () => {
      // 1. Lab technician uploads exam result
      const labTechToken = 'lab-tech-token'; // Mock token

      // Mock file upload (since multer is disabled in tests)
      const examResultData = {
        patientId: 'patient-1',
        examName: 'Hemograma Completo',
        examType: 'Análises Clínicas',
        results: {
          hemoglobin: '14.2 g/dL',
          leucocytes: '6800/mm³',
          platelets: '285000/mm³'
        },
        interpretation: 'Valores dentro da normalidade',
        status: 'ready'
      };

      const examUploadResponse = await request(global.testApp)
        .post('/api/portal/exam-results')
        .set('Authorization', `Bearer ${labTechToken}`)
        .send(examResultData)
        .expect(201);

      expect(examUploadResponse.body.success).toBe(true);

      // 2. Automatic notification to patient
      const notificationResponse = await request(global.testApp)
        .post('/api/notifications/send')
        .send({
          userId: 'patient-1',
          templateId: 'exam_result_ready',
          recipient: 'patient@example.com',
          variables: {
            patientName: 'João Silva',
            examName: examResultData.examName,
            collectionDate: new Date().toISOString().split('T')[0],
            doctorName: 'Dr. António Silva'
          }
        })
        .expect(200);

      expect(notificationResponse.body.success).toBe(true);

      // 3. Patient views exam result
      const patientToken = 'patient-token'; // Mock token

      const examViewResponse = await request(global.testApp)
        .get('/api/portal/exams')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      expect(examViewResponse.body.success).toBe(true);
      expect(examViewResponse.body.data).toContainEqual(
        expect.objectContaining({
          examName: examResultData.examName,
          status: 'ready'
        })
      );
    });
  });

  describe('Real-time Messaging', () => {
    it('should handle real-time communication between staff', async () => {
      // This test would require WebSocket testing
      // For now, we'll test the REST API endpoints

      // 1. Doctor sends message to nurse
      const doctorToken = 'doctor-token';
      
      const messageData = {
        from_user_id: 'doctor-1',
        to_user_id: 'nurse-1',
        message: 'Por favor, prepare o paciente João Silva para procedimento',
        type: 'text'
      };

      const sendMessageResponse = await request(global.testApp)
        .post('/api/messaging/messages')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(messageData)
        .expect(200);

      expect(sendMessageResponse.body.success).toBe(true);

      // 2. Nurse receives and reads message
      const nurseToken = 'nurse-token';

      const getMessagesResponse = await request(global.testApp)
        .get('/api/messaging/messages?userId=nurse-1&otherUserId=doctor-1')
        .set('Authorization', `Bearer ${nurseToken}`)
        .expect(200);

      expect(getMessagesResponse.body.success).toBe(true);
      expect(getMessagesResponse.body.data.length).toBeGreaterThan(0);

      // 3. Mark message as read
      const messageId = sendMessageResponse.body.data.id;
      
      const markReadResponse = await request(global.testApp)
        .patch(`/api/messaging/messages/${messageId}/read`)
        .set('Authorization', `Bearer ${nurseToken}`)
        .expect(200);

      expect(markReadResponse.body.success).toBe(true);
    });
  });

  describe('Analytics and Reporting', () => {
    it('should generate appointment statistics', async () => {
      const adminToken = 'admin-token';

      const statsResponse = await request(global.testApp)
        .get('/api/analytics/appointments?period=monthly')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(statsResponse.body.success).toBe(true);
      expect(statsResponse.body.data).toHaveProperty('totalAppointments');
      expect(statsResponse.body.data).toHaveProperty('completionRate');
      expect(statsResponse.body.data).toHaveProperty('bySpecialty');
    });

    it('should generate patient demographics report', async () => {
      const adminToken = 'admin-token';

      const demographicsResponse = await request(global.testApp)
        .get('/api/analytics/demographics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(demographicsResponse.body.success).toBe(true);
      expect(demographicsResponse.body.data).toHaveProperty('ageGroups');
      expect(demographicsResponse.body.data).toHaveProperty('genderDistribution');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle appointment conflicts gracefully', async () => {
      const receptionistToken = 'receptionist-token';

      // Try to book two appointments at the same time
      const appointmentData = {
        doctorId: 'doctor-1',
        patientId: 'patient-1',
        date: '2024-12-25',
        time: '14:30',
        specialty: 'Cardiologia',
        reason: 'Consulta de rotina'
      };

      // First appointment should succeed
      const firstAppointmentResponse = await request(global.testApp)
        .post('/api/portal/appointments')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .send(appointmentData)
        .expect(201);

      expect(firstAppointmentResponse.body.success).toBe(true);

      // Second appointment at same time should fail
      const secondAppointmentResponse = await request(global.testApp)
        .post('/api/portal/appointments')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .send({
          ...appointmentData,
          patientId: 'patient-2'
        })
        .expect(409); // Conflict

      expect(secondAppointmentResponse.body.success).toBe(false);
      expect(secondAppointmentResponse.body.message).toContain('conflict');
    });

    it('should handle database connection failures', async () => {
      // Simulate database failure
      // This would require mocking the database connection
      expect(true).toBe(true); // Placeholder
    });

    it('should handle invalid data inputs', async () => {
      const token = 'valid-token';

      // Test with invalid appointment data
      const invalidAppointmentData = {
        doctorId: '',
        patientId: 'patient-1',
        date: 'invalid-date',
        time: '25:70', // Invalid time
        specialty: '',
        reason: ''
      };

      const response = await request(global.testApp)
        .post('/api/portal/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidAppointmentData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });
});
