import axios from 'axios';
import { 
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp
} from 'firebase/firestore';
import { db, storage } from '../config/firebase'; // Updated path
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Collections } from '../utils/firebaseCollections';
import { createService } from '../utils/serviceFactory';
import { handleApiError } from '../utils/apiErrorHandler';
import { auditLogger } from './auditLogger';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api/hr`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Create base services using factory
const employeeService = createService(Collections.EMPLOYEES);
const leaveRequestService = createService(Collections.LEAVE_REQUESTS);
const attendanceService = createService(Collections.ATTENDANCE);

class HRService {
  // Dashboard Data
  async getDashboardStats() {
    try {
      const [
        employeesSnapshot,
        leaveRequestsSnapshot,
        attendanceSnapshot
      ] = await Promise.all([
        getDocs(collection(db, Collections.EMPLOYEES)),
        getDocs(query(
          collection(db, Collections.LEAVE_REQUESTS),
          where('status', '==', 'pending')
        )),
        getDocs(query(
          collection(db, Collections.ATTENDANCE),
          where('date', '==', new Date().toISOString().split('T')[0])
        ))
      ]);

      return {
        totalEmployees: employeesSnapshot.size,
        pendingLeaveRequests: leaveRequestsSnapshot.size,
        todayAttendance: attendanceSnapshot.size,
        recentActivities: await this.getRecentActivities()
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getRecentActivities(limit = 5) {
    try {
      const snapshot = await getDocs(query(
        collection(db, 'hrActivities'),
        orderBy('timestamp', 'desc'),
        firestoreLimit(limit)
      ));

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }

  // Task Management
  async createTask(taskData) {
    try {
      const docRef = await addDoc(collection(db, 'hrTasks'), {
        ...taskData,
        createdAt: new Date(),
        status: 'pending'
      });
      
      await auditLogger.log('task_created', { taskId: docRef.id });
      return { id: docRef.id, ...taskData };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Employee Management
  async getEmployees(filters = {}) {
    try {
      let q = collection(db, Collections.EMPLOYEES);
      
      if (filters.department) {
        q = query(q, where('department', '==', filters.department));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async createEmployee(employeeData) {
    try {
      const docRef = await addDoc(collection(db, Collections.EMPLOYEES), {
        ...employeeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      await auditLogger.log('employee_created', { employeeId: docRef.id });
      return { id: docRef.id, ...employeeData };
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(employeeId, employeeData) {
    try {
      const docRef = doc(db, Collections.EMPLOYEES, employeeId);
      await updateDoc(docRef, {
        ...employeeData,
        updatedAt: new Date().toISOString()
      });
      
      await auditLogger.log('employee_updated', { employeeId });
      return { id: employeeId, ...employeeData };
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async deleteEmployee(employeeId) {
    try {
      await deleteDoc(doc(db, Collections.EMPLOYEES, employeeId));
      await auditLogger.log('employee_deleted', { employeeId });
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  // Leave Management
  async getLeaveRequests(filters = {}) {
    try {
      let q = collection(db, Collections.LEAVE_REQUESTS);
      
      if (filters.employeeId) {
        q = query(q, where('employeeId', '==', filters.employeeId));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  }

  async submitLeaveRequest(leaveData) {
    try {
      const docRef = await addDoc(collection(db, Collections.LEAVE_REQUESTS), {
        ...leaveData,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
      
      await auditLogger.log('leave_request_submitted', { requestId: docRef.id });
      return { id: docRef.id, ...leaveData };
    } catch (error) {
      console.error('Error submitting leave request:', error);
      throw error;
    }
  }

  async updateLeaveRequest(id, status) {
    return leaveRequestService.update(id, { status });
  }

  async processLeaveRequest(requestId, decision, remarks) {
    try {
      const leaveRef = doc(db, 'leaveRequests', requestId);
      await updateDoc(leaveRef, {
        status: decision,
        remarks,
        processedAt: new Date()
      });
      
      await auditLogger.log('leave_request_processed', { requestId, decision });
      return { success: true };
    } catch (error) {
      console.error('Error processing leave request:', error);
      throw error;
    }
  }

  // Attendance Management
  async getAttendanceRecords(filters = {}) {
    try {
      let q = collection(db, Collections.ATTENDANCE);
      
      if (filters.date) {
        q = query(q, where('date', '==', filters.date));
      }
      if (filters.employeeId) {
        q = query(q, where('employeeId', '==', filters.employeeId));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw error;
    }
  }

  async markAttendance(attendanceData) {
    try {
      const docRef = await addDoc(collection(db, Collections.ATTENDANCE), {
        ...attendanceData,
        timestamp: new Date().toISOString()
      });
      
      await auditLogger.log('attendance_marked', { 
        attendanceId: docRef.id,
        employeeId: attendanceData.employeeId
      });
      
      return { id: docRef.id, ...attendanceData };
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  // Activity Logging
  async logActivity(activity) {
    try {
      await addDoc(collection(db, 'hrActivities'), {
        ...activity,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error logging HR activity:', error);
      throw error;
    }
  }

  // Document Management
  async uploadEmployeeDocument(employeeId, file, type) {
    try {
      const storageRef = ref(storage, `employees/${employeeId}/documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(db, Collections.EMPLOYEE_DOCUMENTS), {
        employeeId,
        fileName: file.name,
        fileType: type,
        fileUrl: downloadURL,
        uploadedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        fileName: file.name,
        fileUrl: downloadURL
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async getEmployeeDocuments(employeeId) {
    try {
      const q = query(
        collection(db, 'employeeDocuments'),
        where('employeeId', '==', employeeId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching employee documents:', error);
      throw error;
    }
  }

  // Performance Reviews
  async createPerformanceReview(reviewData) {
    try {
      const docRef = await addDoc(collection(db, Collections.PERFORMANCE_REVIEWS), {
        ...reviewData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      await this.logActivity({
        type: 'performance_review_created',
        employeeId: reviewData.employeeId,
        reviewId: docRef.id
      });

      return { id: docRef.id, ...reviewData };
    } catch (error) {
      console.error('Error creating performance review:', error);
      throw error;
    }
  }

  async getPerformanceReviews(employeeId) {
    try {
      const q = query(
        collection(db, Collections.PERFORMANCE_REVIEWS),
        where('employeeId', '==', employeeId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
      throw error;
    }
  }

  // Training Records
  async createTrainingRecord(trainingData) {
    try {
      const docRef = await addDoc(collection(db, 'trainingRecords'), {
        ...trainingData,
        createdAt: serverTimestamp(),
        status: 'scheduled'
      });

      return { id: docRef.id, ...trainingData };
    } catch (error) {
      console.error('Error creating training record:', error);
      throw error;
    }
  }

  async updateTrainingStatus(recordId, status, completion = {}) {
    try {
      const docRef = doc(db, 'trainingRecords', recordId);
      await updateDoc(docRef, {
        status,
        completedAt: status === 'completed' ? serverTimestamp() : null,
        ...completion
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating training status:', error);
      throw error;
    }
  }
}

export default new HRService();
