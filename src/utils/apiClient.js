import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './firebase';

const apiClient = {
  async get(collectionName, id = null) {
    try {
      if (id) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
      }
      
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Firebase GET error:', error);
      throw error;
    }
  },

  async post(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdBy: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Firebase POST error:', error);
      throw error;
    }
  },

  async put(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedBy: auth.currentUser?.uid,
        updatedAt: serverTimestamp()
      });
      return { id, ...data };
    } catch (error) {
      console.error('Firebase PUT error:', error);
      throw error;
    }
  },

  async delete(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Firebase DELETE error:', error);
      throw error;
    }
  },

  async query(collectionName, filters = {}) {
    try {
      let ref = collection(db, collectionName);
      
      if (Object.keys(filters).length > 0) {
        const constraints = Object.entries(filters).map(
          ([field, value]) => where(field, '==', value)
        );
        ref = query(ref, ...constraints);
      }
      
      const querySnapshot = await getDocs(ref);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Firebase query error:', error);
      throw error;
    }
  }
};

export default apiClient;
