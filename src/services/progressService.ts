import { FirestoreService } from './firestoreService';
import { auth } from './firebase';

export class ProgressService {
  private static readonly PROGRESS_KEY = 'aws_restart_progress';

  static async getProgress(): Promise<{ [key: number]: boolean }> {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      // Get progress from Firestore for authenticated users
      try {
        const cloudProgress = await FirestoreService.getUserProgress(currentUser.uid);
        return cloudProgress;
      } catch (error) {
        console.error('Error fetching progress from Firestore:', error);
        // Fallback to local storage
        return this.getLocalProgress();
      }
    } else {
      // Get progress from local storage for guest users
      return this.getLocalProgress();
    }
  }

  static async saveProgress(progress: { [key: number]: boolean }): Promise<void> {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      // Save to Firestore for authenticated users
      try {
        await FirestoreService.saveUserProgress(currentUser.uid, progress);
        // Also update local storage as backup
        this.saveLocalProgress(progress);
      } catch (error) {
        console.error('Error saving progress to Firestore:', error);
        throw error;
      }
    } else {
      // Save to local storage for guest users
      this.saveLocalProgress(progress);
    }
  }

  static async toggleModuleProgress(moduleId: number, completed: boolean): Promise<void> {
    const progress = await this.getProgress();
    progress[moduleId] = completed;
    await this.saveProgress(progress);
  }

  static async resetProgress(): Promise<void> {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      // Reset in Firestore for authenticated users
      try {
        await FirestoreService.resetUserProgress(currentUser.uid);
      } catch (error) {
        console.error('Error resetting progress in Firestore:', error);
      }
    }
    
    // Always reset local storage
    this.resetLocalProgress();
  }

  // Migrate local progress to cloud when user signs up
  static async migrateLocalProgressToCloud(userId: string): Promise<void> {
    const localProgress = this.getLocalProgress();
    if (Object.keys(localProgress).length > 0) {
      try {
        await FirestoreService.saveUserProgress(userId, localProgress);
        console.log('Successfully migrated local progress to cloud');
      } catch (error) {
        console.error('Error migrating progress to cloud:', error);
        throw error;
      }
    }
  }

  // Local storage methods (for guest users and fallback)
  private static getLocalProgress(): { [key: number]: boolean } {
    if (typeof window === 'undefined') return {};
    
    const progressJson = localStorage.getItem(this.PROGRESS_KEY);
    if (!progressJson) return {};
    
    try {
      return JSON.parse(progressJson);
    } catch {
      return {};
    }
  }

  private static saveLocalProgress(progress: { [key: number]: boolean }): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
  }

  private static resetLocalProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.PROGRESS_KEY);
  }
}