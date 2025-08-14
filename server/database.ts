import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

sqlite3.verbose();

const dbPath = path.join(process.cwd(), 'clinic.db');

export interface ContactSubmission {
  id?: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submitted_at: string;
  status: 'pending' | 'responded' | 'archived';
}

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initTables();
      }
    });
  }

  private initTables() {
    const createContactsTable = `
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending'
      )
    `;

    this.db.run(createContactsTable, (err) => {
      if (err) {
        console.error('Error creating contacts table:', err);
      } else {
        console.log('Contact submissions table ready');
      }
    });
  }

  async insertContactSubmission(submission: Omit<ContactSubmission, 'id' | 'submitted_at' | 'status'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO contact_submissions (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run([submission.name, submission.email, submission.phone, submission.subject, submission.message], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
      
      stmt.finalize();
    });
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM contact_submissions ORDER BY submitted_at DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows as ContactSubmission[]);
          }
        }
      );
    });
  }

  async updateSubmissionStatus(id: number, status: ContactSubmission['status']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE contact_submissions SET status = ? WHERE id = ?",
        [status, id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export const database = new Database();
