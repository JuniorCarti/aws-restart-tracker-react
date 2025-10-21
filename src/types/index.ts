export interface Module {
  id: number;
  title: string;
  subtitle?: string;
  isKC: boolean;
  isLab: boolean;
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