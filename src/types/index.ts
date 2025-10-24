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