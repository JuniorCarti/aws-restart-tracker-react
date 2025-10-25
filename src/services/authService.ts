import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';
import { ProgressService } from './progressService';

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile with display name if provided
      if (displayName) {
        await updateProfile(firebaseUser, {
          displayName: displayName
        });
      }

      // Create user document in Firestore
      const userDoc = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName || firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: {} // Initialize empty progress
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);

      // Migrate any local progress to cloud
      try {
        await ProgressService.migrateLocalProgressToCloud(firebaseUser.uid);
      } catch (migrationError) {
        console.error('Progress migration failed:', migrationError);
        // Don't throw - the signup should still succeed
      }

      return this.formatUser(firebaseUser);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last active timestamp
      const firebaseUser = userCredential.user;
      await this.updateLastActive(firebaseUser.uid);
      
      return this.formatUser(firebaseUser);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Sign out
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Get user data from Firestore
  static async getUserData(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return this.formatUserFromFirestore(userData);
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }

  // Update user's last active timestamp
  static async updateLastActive(uid: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        lastActive: new Date(),
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating last active:', error);
      // Don't throw - this is a non-critical operation
    }
  }

  // Format Firebase user to our User type
  private static formatUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      createdAt: new Date()
    };
  }

  // Format Firestore user data to our User type
  private static formatUserFromFirestore(userData: any): User {
    return {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      createdAt: userData.createdAt?.toDate() || new Date()
    };
  }
}