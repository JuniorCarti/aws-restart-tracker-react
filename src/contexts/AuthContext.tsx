import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { AuthService } from '../services/authService';
import { ProgressService } from '../services/progressService';
import { FirestoreService } from '../services/firestoreService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const user = await AuthService.signUp(email, password, displayName);
    setCurrentUser(user);
  };

  const login = async (email: string, password: string) => {
    const user = await AuthService.login(email, password);
    setCurrentUser(user);
  };

  const logout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
  };

  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const userData = await AuthService.getUserData(firebaseUser.uid);
          if (userData) {
            setCurrentUser(userData);
          } else {
            // Fallback to basic user data if Firestore document doesn't exist
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date()
            });
          }
          
          // Update last active timestamp
          await AuthService.updateLastActive(firebaseUser.uid);
        } catch (error) {
          console.error('Error loading user data:', error);
          setCurrentUser(null);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signUp,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};