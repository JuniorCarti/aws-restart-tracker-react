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
return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AWS RESTART</h1>
              <p className="text-sm text-gray-600">Progress Tracker</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetProgress}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Reset Progress"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8 mb-8">
          <div className="flex flex-col items-center text-center">
            <ProgressRing progress={overallProgress} size={140} strokeWidth={10} />
            <h2 className="text-2xl font-bold text-gray-900 mt-6">
              {Math.round(overallProgress * 100)}% Complete
            </h2>
            <p className="text-gray-600 mt-2">
              {totalCompleted} of {modules.length} modules completed
            </p>
          </div>
        </div>
