export interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  location: string;
  status: 'active' | 'closed';
  createdAt: Date;
  closingDate: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  coverLetter: string;
  experience: string[];
  skills: string[];
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  submittedAt: Date;
}

export interface Interview {
  id: string;
  applicationId: string;
  mode: 'online' | 'in-person' | 'phone';
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  decision?: 'proceed' | 'reject' | 'another_round';
}
