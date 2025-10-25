import { 
  doc, getDoc, setDoc, updateDoc, collection, onSnapshot, Unsubscribe,
  getDocs, query, orderBy, limit, where, writeBatch, QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { LeaderboardEntry, UserStats } from '../types';
import { DataService } from './dataService';

export class FirestoreService {
  // Get user progress from Firestore
  static async getUserProgress(userId: string): Promise<{ [key: number]: boolean }> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.progress || {};
      } else {
        // Create user document if it doesn't exist
        await setDoc(userDocRef, {
          progress: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          lastActive: new Date()
        });
        return {};
      }
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  // Save user progress to Firestore
  static async saveUserProgress(userId: string, progress: { [key: number]: boolean }): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userStats = DataService.calculateUserPoints(DataService.getAllModules(), progress);
      
      await updateDoc(userDocRef, {
        progress,
        userStats, // Store calculated stats for leaderboard
        updatedAt: new Date(),
        lastActive: new Date()
      });

      // Update leaderboard entry
      await this.updateLeaderboardEntry(userId, userStats);
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  // Reset user progress in Firestore
  static async resetUserProgress(userId: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const emptyStats: UserStats = {
        totalPoints: 0,
        completedModules: 0,
        completedKCs: 0,
        completedLabs: 0,
        completedExitTickets: 0,
        completedDemonstrations: 0,
        completedActivities: 0
      };

      await updateDoc(userDocRef, {
        progress: {},
        userStats: emptyStats,
        updatedAt: new Date(),
        lastActive: new Date()
      });

      // Update leaderboard with reset stats
      await this.updateLeaderboardEntry(userId, emptyStats);
    } catch (error) {
      console.error('Error resetting user progress:', error);
      throw error;
    }
  }

  // Listen to real-time progress updates
  static subscribeToProgress(userId: string, callback: (progress: { [key: number]: boolean }) => void): Unsubscribe {
    const userDocRef = doc(db, 'users', userId);
    
    return onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        callback(userData.progress || {});
      }
    }, (error) => {
      console.error('Error listening to progress updates:', error);
    });
  }

  // Update user profile data
  static async updateUserProfile(userId: string, profileData: {
    displayName?: string;
    photoURL?: string;
    lastActive?: Date;
  }): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: new Date(),
        lastActive: new Date()
      });

      // Also update leaderboard entry with profile changes
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userStats = userData.userStats || {
          totalPoints: 0,
          completedModules: 0,
          completedKCs: 0,
          completedLabs: 0,
          completedExitTickets: 0,
          completedDemonstrations: 0,
          completedActivities: 0
        };

        await this.updateLeaderboardEntry(userId, userStats, profileData);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(userId: string): Promise<any> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const progress = userData.progress || {};
        const completedCount = Object.values(progress).filter(Boolean).length;
        
        return {
          completedCount,
          totalModules: DataService.getAllModules().length,
          lastActive: userData.updatedAt,
          joinedDate: userData.createdAt,
          userStats: userData.userStats || DataService.calculateUserPoints(DataService.getAllModules(), progress)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // LEADERBOARD METHODS

  // Update or create leaderboard entry for user
  static async updateLeaderboardEntry(
    userId: string, 
    userStats: UserStats, 
    profileData?: { displayName?: string; photoURL?: string; email?: string }
  ): Promise<void> {
    try {
      const leaderboardRef = doc(db, 'leaderboard', userId);
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        const leaderboardEntry = {
          uid: userId,
          displayName: profileData?.displayName || userData.displayName || 'Anonymous',
          email: profileData?.email || userData.email || '',
          photoURL: profileData?.photoURL || userData.photoURL || null,
          totalPoints: userStats.totalPoints,
          completedModules: userStats.completedModules,
          completedKCs: userStats.completedKCs,
          completedLabs: userStats.completedLabs,
          completedExitTickets: userStats.completedExitTickets,
          completedDemonstrations: userStats.completedDemonstrations,
          completedActivities: userStats.completedActivities,
          lastActive: new Date(),
          updatedAt: new Date()
        };

        await setDoc(leaderboardRef, leaderboardEntry, { merge: true });
      }
    } catch (error) {
      console.error('Error updating leaderboard entry:', error);
      throw error;
    }
  }

  // Get leaderboard data
  static async getLeaderboard(limitCount: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const leaderboardQuery = query(
        collection(db, 'leaderboard'),
        orderBy('totalPoints', 'desc'),
        orderBy('lastActive', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(leaderboardQuery);
      const leaderboard: LeaderboardEntry[] = [];
      let index = 0;
      
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        leaderboard.push({
          ...data as Omit<LeaderboardEntry, 'rank'>,
          rank: ++index
        });
      });

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Get user's rank and surrounding players
  static async getUserRank(userId: string, contextCount: number = 2): Promise<{
    userEntry: LeaderboardEntry | null;
    surroundingEntries: LeaderboardEntry[];
    totalUsers: number;
  }> {
    try {
      const allEntries = await this.getLeaderboard(1000); // Get all entries for ranking
      const userIndex = allEntries.findIndex(entry => entry.uid === userId);
      
      if (userIndex === -1) {
        return { userEntry: null, surroundingEntries: [], totalUsers: allEntries.length };
      }

      const userEntry = allEntries[userIndex];
      const start = Math.max(0, userIndex - contextCount);
      const end = Math.min(allEntries.length, userIndex + contextCount + 1);
      
      const surroundingEntries = allEntries.slice(start, end).map((entry, index) => ({
        ...entry,
        rank: start + index + 1
      }));

      return {
        userEntry,
        surroundingEntries,
        totalUsers: allEntries.length
      };
    } catch (error) {
      console.error('Error getting user rank:', error);
      throw error;
    }
  }

  // Listen to real-time leaderboard updates
  static subscribeToLeaderboard(
    limitCount: number, 
    callback: (leaderboard: LeaderboardEntry[]) => void
  ): Unsubscribe {
    const leaderboardQuery = query(
      collection(db, 'leaderboard'),
      orderBy('totalPoints', 'desc'),
      orderBy('lastActive', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(leaderboardQuery, (querySnapshot) => {
      const leaderboard: LeaderboardEntry[] = [];
      let index = 0;
      
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        leaderboard.push({
          ...data as Omit<LeaderboardEntry, 'rank'>,
          rank: ++index
        });
      });
      callback(leaderboard);
    }, (error) => {
      console.error('Error listening to leaderboard updates:', error);
    });
  }

  // Get top performers by module type
  static async getTopPerformersByType(moduleType: keyof UserStats, limitCount: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const fieldMap: Record<string, string> = {
        completedKCs: 'completedKCs',
        completedLabs: 'completedLabs',
        completedExitTickets: 'completedExitTickets',
        completedDemonstrations: 'completedDemonstrations',
        completedActivities: 'completedActivities'
      };

      const field = fieldMap[moduleType];
      if (!field) {
        throw new Error(`Invalid module type: ${moduleType}`);
      }

      const topPerformersQuery = query(
        collection(db, 'leaderboard'),
        orderBy(field, 'desc'),
        orderBy('lastActive', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(topPerformersQuery);
      const performers: LeaderboardEntry[] = [];
      let index = 0;
      
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        performers.push({
          ...data as Omit<LeaderboardEntry, 'rank'>,
          rank: ++index
        });
      });

      return performers;
    } catch (error) {
      console.error('Error getting top performers:', error);
      throw error;
    }
  }

  // Clean up old leaderboard entries (admin function)
  static async cleanupLeaderboard(daysOld: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const oldEntriesQuery = query(
        collection(db, 'leaderboard'),
        where('lastActive', '<', cutoffDate)
      );

      const querySnapshot = await getDocs(oldEntriesQuery);
      const batch = writeBatch(db);

      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Cleaned up ${querySnapshot.size} old leaderboard entries`);
    } catch (error) {
      console.error('Error cleaning up leaderboard:', error);
      throw error;
    }
  }
}