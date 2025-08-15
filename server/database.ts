import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  type: 'text' | 'file' | 'image' | 'document';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FileUpload {
  id: string;
  user_id: string;
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category: 'document' | 'image' | 'exam_result' | 'profile_picture' | 'other';
  compressed_path?: string;
  thumbnail_path?: string;
  created_at: string;
  updated_at: string;
}

export interface VitalSigns {
  id: string;
  patient_id: string;
  appointment_id?: string;
  recorded_by_user_id: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  oxygen_saturation?: number;
  respiratory_rate?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

class DatabaseManager {
  private db: Database.Database;

  constructor() {
    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = join(dataDir, 'clinic.db');
    this.db = new Database(dbPath);

    // Configure database
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = 1000000');
    this.db.pragma('foreign_keys = ON');

    this.initializeTables();
  }

  private initializeTables() {
    // Enhanced users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        birth_date DATE,
        document TEXT,
        document_type TEXT DEFAULT 'BI',
        address TEXT,
        blood_type TEXT,
        allergies TEXT,
        emergency_contact TEXT,
        insurance_provider TEXT,
        insurance_number TEXT,
        role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'nurse', 'receptionist', 'admin')),
        active BOOLEAN DEFAULT 1,
        email_verified BOOLEAN DEFAULT 0,
        avatar_url TEXT,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Messages table for real-time messaging
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        from_user_id TEXT NOT NULL,
        to_user_id TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'text' CHECK (type IN ('text', 'file', 'image', 'document')),
        file_url TEXT,
        file_name TEXT,
        file_size INTEGER,
        read BOOLEAN DEFAULT 0,
        read_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_user_id) REFERENCES users(id),
        FOREIGN KEY (to_user_id) REFERENCES users(id)
      );
    `);

    // File uploads table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS file_uploads (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        category TEXT DEFAULT 'other' CHECK (category IN ('document', 'image', 'exam_result', 'profile_picture', 'other')),
        compressed_path TEXT,
        thumbnail_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Vital signs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vital_signs (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        appointment_id TEXT,
        recorded_by_user_id TEXT NOT NULL,
        blood_pressure_systolic INTEGER,
        blood_pressure_diastolic INTEGER,
        heart_rate INTEGER,
        temperature REAL,
        weight REAL,
        height REAL,
        oxygen_saturation INTEGER,
        respiratory_rate INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id),
        FOREIGN KEY (recorded_by_user_id) REFERENCES users(id),
        FOREIGN KEY (appointment_id) REFERENCES appointments(id)
      );
    `);

    // Enhanced appointments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        doctor_id TEXT,
        doctor_name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        duration INTEGER DEFAULT 30,
        status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
        type TEXT DEFAULT 'consultation' CHECK (type IN ('consultation', 'follow_up', 'emergency', 'procedure')),
        reason TEXT,
        symptoms TEXT,
        notes TEXT,
        doctor_notes TEXT,
        nurse_notes TEXT,
        vital_signs_recorded BOOLEAN DEFAULT 0,
        payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'cancelled')),
        payment_amount DECIMAL(10,2),
        cancelled_at DATETIME,
        cancellation_reason TEXT,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id)
      );
    `);

    // Enhanced exam results table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS exam_results (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        request_id TEXT,
        exam_name TEXT NOT NULL,
        exam_type TEXT NOT NULL,
        category TEXT,
        request_date DATE,
        collection_date DATE,
        exam_date DATE,
        result_date DATE,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'final', 'cancelled')),
        viewed BOOLEAN DEFAULT 0,
        viewed_at DATETIME,
        doctor_name TEXT,
        results TEXT,
        normal_ranges TEXT,
        interpretation TEXT,
        recommendations TEXT,
        file_id TEXT,
        download_count INTEGER DEFAULT 0,
        last_downloaded_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id),
        FOREIGN KEY (file_id) REFERENCES file_uploads(id)
      );
    `);

    // Notification settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notification_settings (
        user_id TEXT PRIMARY KEY,
        email_reminders BOOLEAN DEFAULT 1,
        sms_reminders BOOLEAN DEFAULT 0,
        exam_notifications BOOLEAN DEFAULT 1,
        appointment_reminders BOOLEAN DEFAULT 1,
        health_tips BOOLEAN DEFAULT 0,
        marketing_emails BOOLEAN DEFAULT 0,
        emergency_alerts BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Create indexes for performance
    this.createIndexes();
  }

  private createIndexes() {
    this.db.exec(`
      -- User indexes
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);

      -- Message indexes
      CREATE INDEX IF NOT EXISTS idx_messages_from_user ON messages(from_user_id);
      CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id);
      CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
      CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

      -- File upload indexes
      CREATE INDEX IF NOT EXISTS idx_file_uploads_user ON file_uploads(user_id);
      CREATE INDEX IF NOT EXISTS idx_file_uploads_category ON file_uploads(category);
      CREATE INDEX IF NOT EXISTS idx_file_uploads_created ON file_uploads(created_at);

      -- Vital signs indexes
      CREATE INDEX IF NOT EXISTS idx_vital_signs_patient ON vital_signs(patient_id);
      CREATE INDEX IF NOT EXISTS idx_vital_signs_appointment ON vital_signs(appointment_id);
      CREATE INDEX IF NOT EXISTS idx_vital_signs_created ON vital_signs(created_at);

      -- Appointment indexes
      CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

      -- Exam result indexes
      CREATE INDEX IF NOT EXISTS idx_exam_results_patient ON exam_results(patient_id);
      CREATE INDEX IF NOT EXISTS idx_exam_results_status ON exam_results(status);
      CREATE INDEX IF NOT EXISTS idx_exam_results_viewed ON exam_results(viewed);
    `);
  }

  // Message methods
  createMessage(message: Omit<Message, 'id' | 'created_at' | 'updated_at'>): Message {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO messages 
      (id, from_user_id, to_user_id, message, type, file_url, file_name, file_size, read, read_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      message.from_user_id,
      message.to_user_id,
      message.message,
      message.type,
      message.file_url || null,
      message.file_name || null,
      message.file_size || null,
      message.read ? 1 : 0,
      message.read_at || null
    );

    return {
      ...message,
      id,
      created_at: now,
      updated_at: now
    };
  }

  getMessages(userId: string, otherUserId?: string): Message[] {
    let query = `
      SELECT * FROM messages 
      WHERE (from_user_id = ? OR to_user_id = ?)
    `;
    let params = [userId, userId];

    if (otherUserId) {
      query += ` AND ((from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?))`;
      params = [userId, userId, otherUserId, userId, userId, otherUserId];
    }

    query += ` ORDER BY created_at DESC`;

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Message[];
  }

  markMessageAsRead(messageId: string): boolean {
    const stmt = this.db.prepare(`
      UPDATE messages 
      SET read = 1, read_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    return stmt.run(messageId).changes > 0;
  }

  // File upload methods
  createFileUpload(file: Omit<FileUpload, 'id' | 'created_at' | 'updated_at'>): FileUpload {
    const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO file_uploads 
      (id, user_id, original_name, file_name, file_path, file_size, mime_type, category, compressed_path, thumbnail_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      file.user_id,
      file.original_name,
      file.file_name,
      file.file_path,
      file.file_size,
      file.mime_type,
      file.category,
      file.compressed_path || null,
      file.thumbnail_path || null
    );

    return {
      ...file,
      id,
      created_at: now,
      updated_at: now
    };
  }

  getFileUpload(id: string): FileUpload | null {
    const stmt = this.db.prepare('SELECT * FROM file_uploads WHERE id = ?');
    return stmt.get(id) as FileUpload | null;
  }

  getUserFiles(userId: string, category?: string): FileUpload[] {
    let query = 'SELECT * FROM file_uploads WHERE user_id = ?';
    let params = [userId];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = this.db.prepare(query);
    return stmt.all(...params) as FileUpload[];
  }

  // Vital signs methods
  createVitalSigns(vitals: Omit<VitalSigns, 'id' | 'created_at' | 'updated_at'>): VitalSigns {
    const id = `vital_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO vital_signs 
      (id, patient_id, appointment_id, recorded_by_user_id, blood_pressure_systolic, 
       blood_pressure_diastolic, heart_rate, temperature, weight, height, 
       oxygen_saturation, respiratory_rate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      vitals.patient_id,
      vitals.appointment_id || null,
      vitals.recorded_by_user_id,
      vitals.blood_pressure_systolic || null,
      vitals.blood_pressure_diastolic || null,
      vitals.heart_rate || null,
      vitals.temperature || null,
      vitals.weight || null,
      vitals.height || null,
      vitals.oxygen_saturation || null,
      vitals.respiratory_rate || null,
      vitals.notes || null
    );

    return {
      ...vitals,
      id,
      created_at: now,
      updated_at: now
    };
  }

  getPatientVitalSigns(patientId: string): VitalSigns[] {
    const stmt = this.db.prepare(`
      SELECT * FROM vital_signs 
      WHERE patient_id = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(patientId) as VitalSigns[];
  }

  // User methods
  getUserById(id: string): any {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  getUserByEmail(email: string): any {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  getUsersByRole(role: string): any[] {
    const stmt = this.db.prepare('SELECT * FROM users WHERE role = ? AND active = 1');
    return stmt.all(role);
  }

  close() {
    this.db.close();
  }
}

export const database = new DatabaseManager();
