import axios from 'axios';

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

const hrService = {
  // Employee Management
  async getEmployees(params = {}) {
    return await api.get('/employees', { params });
  },

  async createEmployee(employeeData) {
    return await api.post('/employees', employeeData);
  },

  async updateEmployee(id, employeeData) {
    return await api.put(`/employees/${id}`, employeeData);
  },

  // Attendance Management
  async getAttendance(params = {}) {
    return await api.get('/attendance', { params });
  },

  async markAttendance(attendanceData) {
    return await api.post('/attendance', attendanceData);
  },

  // Leave Management
  async getLeaveRequests(params = {}) {
    return await api.get('/leave-requests', { params });
  },

  async submitLeaveRequest(leaveData) {
    return await api.post('/leave-requests', leaveData);
  },

  async updateLeaveRequest(id, status) {
    return await api.put(`/leave-requests/${id}`, { status });
  },

  // Recruitment
  async getJobPostings(params = {}) {
    return await api.get('/jobs', { params });
  },

  async createJobPosting(jobData) {
    return await api.post('/jobs', jobData);
  },

  async getCandidates(params = {}) {
    return await api.get('/candidates', { params });
  },

  // Payroll
  async getPayrollData(params = {}) {
    return await api.get('/payroll', { params });
  },

  async processPayroll(payrollData) {
    return await api.post('/payroll/process', payrollData);
  },

  // Reports
  async generateReport(reportType, params = {}) {
    return await api.get(`/reports/${reportType}`, { params });
  }
};

export default hrService;
