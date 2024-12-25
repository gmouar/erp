import axios from 'axios';
import { 
  collection,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase'; // Updated path
import { Collections } from '../utils/firebaseCollections';
import { createService } from '../utils/serviceFactory';
import { handleApiError } from '../utils/apiErrorHandler';

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
  // Employee Management
  async getEmployees() {
    return employeeService.getAll();
  }

  async createEmployee(employeeData) {
    return employeeService.create(employeeData);
  }

  async updateEmployee(id, employeeData) {
    return employeeService.update(id, employeeData);
  }

  async deleteEmployee(id) {
    return employeeService.delete(id);
  }

  // Leave Management
  async getLeaveRequests() {
    return leaveRequestService.getAll();
  }

  async submitLeaveRequest(leaveData) {
    return leaveRequestService.create(leaveData);
  }

  async updateLeaveRequest(id, status) {
    return leaveRequestService.update(id, { status });
  }

  // Attendance Management
  async getAttendance(filters = {}) {
    try {
      let query = db.collection(Collections.ATTENDANCE);
      
      if (filters.startDate) {
        query = query.where('date', '>=', filters.startDate);
      }
      if (filters.endDate) {
        query = query.where('date', '<=', filters.endDate);
      }
      if (filters.employeeId) {
        query = query.where('employeeId', '==', filters.employeeId);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async markAttendance(attendanceData) {
    return attendanceService.create(attendanceData);
  }
}

export default new HRService();
