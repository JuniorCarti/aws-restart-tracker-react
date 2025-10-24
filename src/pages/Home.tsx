import React, { useState, useEffect } from 'react';
import { ProgressRing } from '../components/ProgressRing';
import { CategoryCard } from '../components/CategoryCard';
import { DataService } from '../services/dataService';
import { ProgressService } from '../services/progressService';
import { Module, CategoryStats, ModuleTypeStats } from '../types';

export const Home: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = () => {
    const allModules = DataService.getAllModules();
    const userProgress = ProgressService.getProgress();
    
    setModules(allModules);
    setProgress(userProgress);
    setLoading(false);
  };
  const totalCompleted = DataService.getTotalCompleted(progress);
  const overallProgress = DataService.getOverallProgress(modules, progress);
  const categoryStats = DataService.getCategoryStats(modules, progress);
  const moduleTypeStats = DataService.getModuleTypeStats(modules, progress);

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      ProgressService.resetProgress();
      loadData();
    }
  };
