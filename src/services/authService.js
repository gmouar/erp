import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const authService = {
  async login({ username, password }) {
    try {
      // Convert username to email format if it's not already an email
      const email = username.includes('@') ? username : `${username}@yourdomain.com`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get complete user data from Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      // Update last login
      await updateDoc(userDocRef, {
        lastLogin: new Date().toISOString()
      });

      // Combine Firebase user and Firestore data
      const user = {
        ...userCredential.user,
        ...userData,
        id: userCredential.user.uid
      };

      return {
        success: true,
        user,
        userData,
        requires2FA: userData?.has2FAEnabled || false
      };
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = this.getErrorMessage(error.code);
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Invalid password';
      default:
        return 'An error occurred during authentication';
    }
  },

  async register({ email, password, username }) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      username,
      email,
      role: 'Unassigned',
      has2FAEnabled: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });

    return userCredential.user;
  },

  async verify2FA(code) {
    const user = auth.currentUser;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    // Implement 2FA verification logic here
    return userDoc.data();
  },

  async setup2FA() {
    const user = auth.currentUser;
    // Implement 2FA setup logic here
    await updateDoc(doc(db, "users", user.uid), {
      has2FAEnabled: true
    });
    return { success: true };
  },

  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },

  async logout() {
    await signOut(auth);
    return { success: true };
  }
};

export default authService;
