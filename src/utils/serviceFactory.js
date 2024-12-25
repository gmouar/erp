import { db } from '../config/firebase'; // Updated path
import { handleApiError } from './apiErrorHandler';

export const createService = (collectionName) => {
  return {
    async getAll() {
      try {
        const querySnapshot = await db.collection(collectionName).get();
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        throw handleApiError(error);
      }
    },

    async getById(id) {
      try {
        const doc = await db.collection(collectionName).doc(id).get();
        if (!doc.exists) {
          throw new Error('Document not found');
        }
        return { id: doc.id, ...doc.data() };
      } catch (error) {
        throw handleApiError(error);
      }
    },

    async create(data) {
      try {
        const docRef = await db.collection(collectionName).add({
          ...data,
          createdAt: new Date().toISOString()
        });
        return { id: docRef.id, ...data };
      } catch (error) {
        throw handleApiError(error);
      }
    },

    async update(id, data) {
      try {
        await db.collection(collectionName).doc(id).update({
          ...data,
          updatedAt: new Date().toISOString()
        });
        return { id, ...data };
      } catch (error) {
        throw handleApiError(error);
      }
    },

    async delete(id) {
      try {
        await db.collection(collectionName).doc(id).delete();
        return true;
      } catch (error) {
        throw handleApiError(error);
      }
    }
  };
};
