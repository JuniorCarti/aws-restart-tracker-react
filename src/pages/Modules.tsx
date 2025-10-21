import React, { useState, useEffect } from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { DataService } from '../services/dataService';
import { ProgressService } from '../services/progressService';
import { Module } from '../types';

export const Modules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<{ [key: number]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allModules = DataService.getAllModules();
    const userProgress = ProgressService.getProgress();
    
    setModules(allModules);
    setProgress(userProgress);
  };

  const categories = ['All', ...Array.from(new Set(modules.map(m => m.category)))];
  const filteredModules = selectedCategory === 'All' 
    ? modules 
    : modules.filter(m => m.category === selectedCategory);

  const toggleModule = (moduleId: number, completed: boolean) => {
    ProgressService.toggleModuleProgress(moduleId, completed);
    setProgress(prev => ({ ...prev, [moduleId]: completed }));
  };

  const completedCount = filteredModules.filter(m => progress[m.id]).length;
  const totalCount = filteredModules.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Modules</h1>
              <p className="text-sm text-gray-600">{completedCount}/{totalCount} completed</p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-aws-blue text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-aws-blue'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Modules List */}
        <div className="space-y-3">
          {filteredModules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              isCompleted={!!progress[module.id]}
              onToggle={toggleModule}
            />
          ))}
        </div>
      </main>
    </div>
  );
};