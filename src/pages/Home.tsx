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
  // Fixed navigation function for hash routing
  const navigateTo = (path: string) => {
    console.log('Navigating to:', path);
    window.location.hash = path;
  };

  // Function to handle category clicks
  const handleCategoryClick = (category: string) => {
    console.log(`Category clicked: ${category}`);
    navigateTo(`/modules?category=${encodeURIComponent(category)}`);
  };

  // Function to handle quick action clicks
  const handleQuickActionClick = (type?: string) => {
    console.log(`Quick action clicked: ${type || 'all modules'}`);
    if (type) {
      navigateTo(`/modules?type=${type}`);
    } else {
      navigateTo('/modules');
    }
  };
  // Function to handle module type statistic clicks
  const handleTypeStatClick = (type: string) => {
    console.log(`Type stat clicked: ${type}`);
    navigateTo(`/modules?type=${type}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-aws-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">☁️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">AWS RESTART</h2>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }
