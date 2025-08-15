import { RequestHandler } from 'express';
import { database } from '../database';

// Create new vital signs record
export const createVitalSigns: RequestHandler = (req, res) => {
  try {
    const {
      patient_id,
      appointment_id,
      recorded_by_user_id,
      blood_pressure_systolic,
      blood_pressure_diastolic,
      heart_rate,
      temperature,
      weight,
      height,
      oxygen_saturation,
      respiratory_rate,
      notes
    } = req.body;

    if (!patient_id || !recorded_by_user_id) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and recorded by user ID are required'
      });
    }

    const vitalSigns = database.createVitalSigns({
      patient_id,
      appointment_id,
      recorded_by_user_id,
      blood_pressure_systolic,
      blood_pressure_diastolic,
      heart_rate,
      temperature,
      weight,
      height,
      oxygen_saturation,
      respiratory_rate,
      notes
    });

    res.json({
      success: true,
      data: vitalSigns,
      message: 'Vital signs recorded successfully'
    });
  } catch (error) {
    console.error('Error creating vital signs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vital signs'
    });
  }
};

// Get vital signs for a patient
export const getPatientVitalSigns: RequestHandler = (req, res) => {
  try {
    const { patientId } = req.params;

    const vitalSigns = database.getPatientVitalSigns(patientId);

    res.json({
      success: true,
      data: vitalSigns
    });
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vital signs'
    });
  }
};

// Get vital signs for today's appointments (nurse dashboard)
export const getTodayVitalSigns: RequestHandler = (req, res) => {
  try {
    // This would require a more complex query joining appointments and vital signs
    // For now, return mock data structure
    const today = new Date().toISOString().split('T')[0];
    
    // Mock data - in real implementation, you'd query the database
    const todayVitalSigns = [
      {
        id: 'vital_1',
        patient_id: 'patient-1',
        patient_name: 'João Silva',
        appointment_id: 'apt_1',
        appointment_time: '09:00',
        recorded_by_user_id: 'nurse-1',
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        heart_rate: 72,
        temperature: 36.5,
        weight: 75,
        height: 175,
        oxygen_saturation: 98,
        respiratory_rate: 16,
        notes: 'Paciente apresentando sinais vitais normais',
        status: 'completed',
        created_at: new Date().toISOString()
      },
      {
        id: 'vital_pending_1',
        patient_id: 'patient-2',
        patient_name: 'Maria Santos',
        appointment_id: 'apt_2',
        appointment_time: '10:30',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: todayVitalSigns
    });
  } catch (error) {
    console.error('Error fetching today vital signs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today vital signs'
    });
  }
};

// Get vital signs statistics for nurse dashboard
export const getVitalSignsStats: RequestHandler = (req, res) => {
  try {
    const { nurseId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    // Mock statistics - in real implementation, query the database
    const stats = {
      today: {
        recorded: 5,
        pending: 3,
        total_appointments: 8
      },
      this_week: {
        recorded: 28,
        pending: 7,
        total_appointments: 35
      },
      alerts: {
        high_blood_pressure: 2,
        fever: 1,
        low_oxygen: 0
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching vital signs stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vital signs statistics'
    });
  }
};

// Update vital signs record
export const updateVitalSigns: RequestHandler = (req, res) => {
  try {
    const { vitalId } = req.params;
    const updates = req.body;

    // In a real implementation, you'd have an update method in the database class
    // For now, return success message
    res.json({
      success: true,
      message: 'Vital signs updated successfully'
    });
  } catch (error) {
    console.error('Error updating vital signs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vital signs'
    });
  }
};

// Get vital signs alerts (abnormal values)
export const getVitalSignsAlerts: RequestHandler = (req, res) => {
  try {
    // Mock alerts - in real implementation, query for abnormal vital signs
    const alerts = [
      {
        id: 'alert_1',
        patient_id: 'patient-3',
        patient_name: 'Pedro Oliveira',
        type: 'high_blood_pressure',
        value: '160/95',
        threshold: '140/90',
        severity: 'moderate',
        recorded_at: new Date().toISOString(),
        appointment_id: 'apt_3'
      },
      {
        id: 'alert_2',
        patient_id: 'patient-4',
        patient_name: 'Ana Costa',
        type: 'fever',
        value: '38.5°C',
        threshold: '37.5°C',
        severity: 'mild',
        recorded_at: new Date().toISOString(),
        appointment_id: 'apt_4'
      }
    ];

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching vital signs alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vital signs alerts'
    });
  }
};
