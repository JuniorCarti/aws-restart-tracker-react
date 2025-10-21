export class ProgressService {
  private static readonly PROGRESS_KEY = 'aws_restart_progress';

  static getProgress(): { [key: number]: boolean } {
    if (typeof window === 'undefined') return {};
    
    const progressJson = localStorage.getItem(this.PROGRESS_KEY);
    if (!progressJson) return {};
    
    try {
      return JSON.parse(progressJson);
    } catch {
      return {};
    }
  }

  static saveProgress(progress: { [key: number]: boolean }): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
  }

  static toggleModuleProgress(moduleId: number, completed: boolean): void {
    const progress = this.getProgress();
    progress[moduleId] = completed;
    this.saveProgress(progress);
  }

  static resetProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.PROGRESS_KEY);
  }
}