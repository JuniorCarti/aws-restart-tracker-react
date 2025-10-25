export interface Module {
  id: number;
  title: string;
  subtitle?: string;
  isKC: boolean;        // Knowledge Check
  isLab: boolean;       // Lab Exercise
  isExitTicket: boolean; // Exit Ticket
  isDemonstration: boolean; // Demonstration
  isActivity: boolean;  // Activity
  category: string;
}

export interface ModuleProgress {
  moduleId: number;
  isCompleted: boolean;
  completedDate?: Date;
  notes?: string;
}

export interface CategoryStats {
  [category: string]: number;
}

export interface ModuleTypeStats {
  labs: number;
  knowledgeChecks: number;
  exitTickets: number;
  demonstrations: number;
  activities: number;
  total: number;
}

export interface CategoryProgress {
  category: string;
  completed: number;
  total: number;
  percentage: number;
  typeBreakdown: {
    labs: number;
    knowledgeChecks: number;
    exitTickets: number;
    demonstrations: number;
    activities: number;
  };
}

export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector or 'global'
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface AppConfig {
  showOnboarding: boolean;
}

// Authentication Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: Date;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  totalPoints: number;
  completedModules: number;
  completedKCs: number;
  completedLabs: number;
  completedExitTickets: number;
  completedDemonstrations: number;
  completedActivities: number;
  rank: number;
  lastActive: Date;
}

export interface PointsSystem {
  knowledgeChecks: number;
  labs: number;
  exitTickets: number;
  demonstrations: number;
  activities: number;
}

export interface UserStats {
  totalPoints: number;
  completedModules: number;
  completedKCs: number;
  completedLabs: number;
  completedExitTickets: number;
  completedDemonstrations: number;
  completedActivities: number;
  rank?: number;
  totalUsers?: number;
}

export interface LeaderboardFilters {
  timeRange: 'all-time' | 'weekly' | 'monthly';
  category?: string;
}