import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { createService } from '../utils/serviceFactory';
import notificationService from './notificationService';

const jobPostingsService = createService('jobPostings');
const jobApplicationsService = createService('jobApplications');
const interviewsService = createService('interviews');

class RecruitmentService {
  // Job Posting Management
  async createJobPosting(postingData) {
    return jobPostingsService.create({
      ...postingData,
      status: 'active',
      createdAt: new Date()
    });
  }

  async getActiveJobPostings() {
    const q = query(
      collection(db, 'jobPostings'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    return jobPostingsService.getWithQuery(q);
  }

  // Application Management
  async submitApplication(applicationData) {
    const application = await jobApplicationsService.create({
      ...applicationData,
      status: 'pending',
      submittedAt: new Date()
    });
    
    await notificationService.sendNotification({
      userId: applicationData.applicantId,
      type: 'application_received',
      message: 'Your application has been received'
    });

    return application;
  }

  async updateApplicationStatus(applicationId, status) {
    const application = await jobApplicationsService.update(applicationId, { status });
    
    await notificationService.sendNotification({
      userId: application.applicantId,
      type: 'application_status',
      message: `Your application status has been updated to ${status}`
    });

    return application;
  }

  // Interview Management
  async scheduleInterview(interviewData) {
    const interview = await interviewsService.create({
      ...interviewData,
      status: 'scheduled'
    });

    const application = await jobApplicationsService.get(interview.applicationId);
    await this.updateApplicationStatus(interview.applicationId, 'interview');

    await notificationService.sendNotification({
      userId: application.applicantId,
      type: 'interview_scheduled',
      message: `An interview has been scheduled for ${new Date(interview.scheduledDate).toLocaleString()}`
    });

    return interview;
  }

  async updateInterviewFeedback(interviewId, feedback, decision) {
    return interviewsService.update(interviewId, {
      feedback,
      decision,
      status: 'completed'
    });
  }

  // Getters
  async getApplicationsByJob(jobId) {
    const q = query(
      collection(db, 'jobApplications'),
      where('jobId', '==', jobId)
    );
    return jobApplicationsService.getWithQuery(q);
  }

  async getApplicationsByUser(userId) {
    const q = query(
      collection(db, 'jobApplications'),
      where('applicantId', '==', userId)
    );
    return jobApplicationsService.getWithQuery(q);
  }
}

export default new RecruitmentService();
