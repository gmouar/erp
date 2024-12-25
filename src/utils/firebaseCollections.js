import { collection } from 'firebase/firestore';
import { db } from '../config/firebase'; // Updated path

export const Collections = {
  USERS: 'users',
  EMPLOYEES: 'employees',
  DEPARTMENTS: 'departments',
  LEAVE_REQUESTS: 'leaveRequests',
  ATTENDANCE: 'attendance',
  PAYROLL: 'payroll',
  PERFORMANCE_REVIEWS: 'performanceReviews'
};

// Get collection references
export const getCollection = (collectionName) => collection(db, collectionName);
