import React, { useState, useEffect } from 'react';
import { ProgressRing } from '../components/ProgressRing';
import { CategoryCard } from '../components/CategoryCard';
import { OnboardingTour } from '../components/OnboardingTour';
import { DataService } from '../services/dataService';
import { ProgressService } from '../services/progressService';
import { OnboardingService } from '../services/onboardingService';
import { Module, CategoryStats, ModuleTypeStats } from '../types';

export const Home: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    loadData();
    checkOnboarding();
  }, []);

  const loadData = () => {
    const allModules = DataService.getAllModules();
    const userProgress = ProgressService.getProgress();
    
    setModules(allModules);
    setProgress(userProgress);
    setLoading(false);
  };

  const checkOnboarding = () => {
    const config = OnboardingService.getConfig();
    setShowOnboarding(config.showOnboarding);
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

  const resetOnboarding = () => {
    OnboardingService.resetOnboarding();
    setShowOnboarding(true);
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

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
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
      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

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
                onClick={resetOnboarding}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Show Tutorial Again"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
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
        {/* Progress Overview - Add class for tour */}
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8 mb-8 progress-ring-container">
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

        {/* Module Type Statistics - Add class for tour */}
        <section className="mb-8 module-type-stats">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress by Module Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Labs */}
            <div 
              className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleTypeStatClick('labs')}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-500">LABS</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {moduleTypeStats.labs}
                <span className="text-sm font-normal text-gray-500 block">
                  / {modules.filter(m => m.isLab).length}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((moduleTypeStats.labs / modules.filter(m => m.isLab).length) * 100) || 0}%
              </div>
            </div>

            {/* Knowledge Checks */}
            <div 
              className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleTypeStatClick('knowledge-checks')}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-500">KNOWLEDGE CHECKS</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {moduleTypeStats.knowledgeChecks}
                <span className="text-sm font-normal text-gray-500 block">
                  / {modules.filter(m => m.isKC).length}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((moduleTypeStats.knowledgeChecks / modules.filter(m => m.isKC).length) * 100) || 0}%
              </div>
            </div>

            {/* Exit Tickets */}
            <div 
              className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleTypeStatClick('exit-tickets')}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-500">EXIT TICKETS</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {moduleTypeStats.exitTickets}
                <span className="text-sm font-normal text-gray-500 block">
                  / {modules.filter(m => m.isExitTicket).length}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((moduleTypeStats.exitTickets / modules.filter(m => m.isExitTicket).length) * 100) || 0}%
              </div>
            </div>

            {/* Demonstrations */}
            <div 
              className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleTypeStatClick('demonstrations')}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-500">DEMONSTRATIONS</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {moduleTypeStats.demonstrations}
                <span className="text-sm font-normal text-gray-500 block">
                  / {modules.filter(m => m.isDemonstration).length}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((moduleTypeStats.demonstrations / modules.filter(m => m.isDemonstration).length) * 100) || 0}%
              </div>
            </div>

            {/* Activities */}
            <div 
              className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleTypeStatClick('activities')}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-500">ACTIVITIES</span>
              </div>
              <div className="text-2xl font-bold text-indigo-600">
                {moduleTypeStats.activities}
                <span className="text-sm font-normal text-gray-500 block">
                  / {modules.filter(m => m.isActivity).length}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((moduleTypeStats.activities / modules.filter(m => m.isActivity).length) * 100) || 0}%
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid - Add class for tour */}
        <section className="mb-8 categories-grid">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
            <span className="text-sm text-gray-500">
              {Object.keys(categoryStats).length} categories
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(categoryStats).map(([category, completedCount]) => {
              const categoryModules = modules.filter(m => m.category === category);
              const categoryProgress = categoryModules.length > 0 ? completedCount / categoryModules.length : 0;
              const categoryTypeStats = {
                labs: categoryModules.filter(m => m.isLab && progress[m.id]).length,
                knowledgeChecks: categoryModules.filter(m => m.isKC && progress[m.id]).length,
                exitTickets: categoryModules.filter(m => m.isExitTicket && progress[m.id]).length,
                demonstrations: categoryModules.filter(m => m.isDemonstration && progress[m.id]).length,
                activities: categoryModules.filter(m => m.isActivity && progress[m.id]).length
              };
              
              return (
                <CategoryCard
                  key={category}
                  category={category}
                  completed={completedCount}
                  total={categoryModules.length}
                  progress={categoryProgress}
                  typeStats={categoryTypeStats}
                  onTap={() => handleCategoryClick(category)}
                />
              );
            })}
          </div>
        </section>

        {/* Quick Actions - Add class for tour */}
        <section className="quick-actions">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-200"
              onClick={() => handleQuickActionClick()}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">All Modules</h3>
                  <p className="text-sm text-gray-600">Browse all learning content</p>
                </div>
              </div>
            </div>
            
            <div
              className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-green-200"
              onClick={() => handleQuickActionClick('labs')}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Labs</h3>
                  <p className="text-sm text-gray-600">Hands-on exercises</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-purple-200"
              onClick={() => handleQuickActionClick('exit-tickets')}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Exit Tickets</h3>
                  <p className="text-sm text-gray-600">Assessment checkpoints</p>
                </div>
              </div>
            </div>
            
            <div
              className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-orange-200"
              onClick={() => navigateTo('/stats')}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-600">Detailed progress insights</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};