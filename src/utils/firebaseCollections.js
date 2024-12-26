import { collection } from 'firebase/firestore';
import { db } from '../config/firebase'; // Updated path

export const Collections = {
  USERS: 'users',
  EMPLOYEES: 'employees',
  DEPARTMENTS: 'departments',
  LEAVE_REQUESTS: 'leave_requests',
  ATTENDANCE: 'attendance',
  PAYROLL: 'payroll',
  PERFORMANCE_REVIEWS: 'performanceReviews',
  HR_ACTIVITIES: 'hr_activities',
  POSITIONS: 'positions',
  EMPLOYEE_DOCUMENTS: 'employeeDocuments',
  TRAINING_RECORDS: 'trainingRecords',
  HR_TASKS: 'hrTasks',
  HR_POLICIES: 'hrPolicies'
};

// Firestore indexes needed:
/*
employees:
- department (ascending)
- status (ascending)
- createdAt (descending)

leave_requests:
- employeeId (ascending)
- status (ascending)
- submittedAt (descending)

attendance:
- employeeId (ascending)
- date (ascending)
- timestamp (descending)
*/

// Get collection references
export const getCollection = (collectionName) => collection(db, collectionName);
