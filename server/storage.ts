import fs from 'fs-extra';
import path from 'path';

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: 'consulta' | 'duvida' | 'sugestao';
  message: string;
  submitted_at: string;
  status: 'pending' | 'responded' | 'archived';
}

class ContactStorage {
  private dataFile: string;
  private data: ContactSubmission[] = [];
  private nextId: number = 1;

  constructor() {
    this.dataFile = path.join(process.cwd(), 'data', 'contact-submissions.json');
    this.loadData();
  }

  private async ensureDataDirectory() {
    const dataDir = path.dirname(this.dataFile);
    await fs.ensureDir(dataDir);
  }

  private async loadData() {
    try {
      await this.ensureDataDirectory();
      
      if (await fs.pathExists(this.dataFile)) {
        const fileContent = await fs.readFile(this.dataFile, 'utf-8');
        const parsedData = JSON.parse(fileContent);
        
        this.data = parsedData.submissions || [];
        this.nextId = parsedData.nextId || 1;
      } else {
        // Initialize with empty data
        await this.saveData();
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
      this.data = [];
      this.nextId = 1;
    }
  }

  private async saveData() {
    try {
      await this.ensureDataDirectory();
      
      const dataToSave = {
        submissions: this.data,
        nextId: this.nextId,
        lastUpdated: new Date().toISOString()
      };
      
      await fs.writeFile(this.dataFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving contact data:', error);
      throw error;
    }
  }

  async addSubmission(submission: Omit<ContactSubmission, 'id' | 'submitted_at' | 'status'>): Promise<number> {
    const newSubmission: ContactSubmission = {
      id: this.nextId++,
      ...submission,
      submitted_at: new Date().toISOString(),
      status: 'pending'
    };

    this.data.unshift(newSubmission); // Add to beginning for chronological order
    await this.saveData();
    
    console.log(`Contact submission saved with ID: ${newSubmission.id}`);
    return newSubmission.id;
  }

  async getSubmissions(): Promise<ContactSubmission[]> {
    return [...this.data]; // Return a copy
  }

  async getSubmissionById(id: number): Promise<ContactSubmission | null> {
    return this.data.find(submission => submission.id === id) || null;
  }

  async updateSubmissionStatus(id: number, status: ContactSubmission['status']): Promise<boolean> {
    const index = this.data.findIndex(submission => submission.id === id);
    
    if (index === -1) {
      return false;
    }

    this.data[index].status = status;
    await this.saveData();
    
    console.log(`Contact submission ${id} status updated to: ${status}`);
    return true;
  }

  async getSubmissionsByStatus(status: ContactSubmission['status']): Promise<ContactSubmission[]> {
    return this.data.filter(submission => submission.status === status);
  }

  async getSubmissionsCount(): Promise<number> {
    return this.data.length;
  }

  async exportSubmissions(): Promise<string> {
    // Export as CSV format
    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Assunto', 'Mensagem', 'Data/Hora', 'Status'];
    const csvRows = [headers.join(',')];

    for (const submission of this.data) {
      const row = [
        submission.id,
        `"${submission.name.replace(/"/g, '""')}"`,
        submission.email,
        submission.phone,
        submission.subject,
        `"${submission.message.replace(/"/g, '""')}"`,
        submission.submitted_at,
        submission.status
      ];
      csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
  }
}

export const contactStorage = new ContactStorage();
