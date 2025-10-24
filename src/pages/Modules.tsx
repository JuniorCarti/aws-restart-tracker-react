import React, { useState, useEffect } from 'react';
import { ModuleCard } from '../components/ModuleCard';
import { DataService } from '../services/dataService';
import { ProgressService } from '../services/progressService';
import { Module } from '../types';

export const Modules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<{ [key: number]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadData();
    readUrlParameters();
  }, []);

  const loadData = () => {
    const allModules = DataService.getAllModules();
    const userProgress = ProgressService.getProgress();
    
    setModules(allModules);
    setProgress(userProgress);
  };

  // NEW: Read URL parameters to set initial filters
  const readUrlParameters = () => {
    const hash = window.location.hash;
    console.log('Current hash:', hash);
    
    if (hash.includes('?')) {
      const queryString = hash.split('?')[1];
      const urlParams = new URLSearchParams(queryString);
      
      const category = urlParams.get('category');
      const type = urlParams.get('type');
      
      console.log('URL parameters - category:', category, 'type:', type);
      
      if (category) {
        setSelectedCategory(category);
      }
      
      if (type) {
        setSelectedType(type);
      }
    }
  };

  const categories = ['All', ...Array.from(new Set(modules.map(m => m.category)))];
  
  // Filter modules based on category, type, and search term
  const filteredModules = modules.filter(module => {
    const categoryMatch = selectedCategory === 'All' || module.category === selectedCategory;
    
    const typeMatch = selectedType === 'all' || 
      (selectedType === 'labs' && module.isLab) ||
      (selectedType === 'knowledge-checks' && module.isKC) ||
      (selectedType === 'exit-tickets' && module.isExitTicket) ||
      (selectedType === 'demonstrations' && module.isDemonstration) ||
      (selectedType === 'activities' && module.isActivity);
    
    const searchMatch = searchTerm === '' || 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && typeMatch && searchMatch;
  });

  const toggleModule = (moduleId: number, completed: boolean) => {
    ProgressService.toggleModuleProgress(moduleId, completed);
    setProgress(prev => ({ ...prev, [moduleId]: completed }));
  };

  const completedCount = filteredModules.filter(m => progress[m.id]).length;
  const totalCount = filteredModules.length;

  // Get counts for each module type in current filter
  const getTypeCounts = () => {
    const currentModules = selectedCategory === 'All' 
      ? modules 
      : modules.filter(m => m.category === selectedCategory);
    
    return {
      all: currentModules.length,
      labs: currentModules.filter(m => m.isLab).length,
      knowledgeChecks: currentModules.filter(m => m.isKC).length,
      exitTickets: currentModules.filter(m => m.isExitTicket).length,
      demonstrations: currentModules.filter(m => m.isDemonstration).length,
      activities: currentModules.filter(m => m.isActivity).length
    };
  };

  const typeCounts = getTypeCounts();

  // Update URL when filters change (optional - for better UX)
  const updateUrl = (category: string, type: string) => {
    const params = new URLSearchParams();
    
    if (category && category !== 'All') {
      params.append('category', category);
    }
    
    if (type && type !== 'all') {
      params.append('type', type);
    }
    
    const queryString = params.toString();
    const newHash = queryString ? `/modules?${queryString}` : '/modules';
    
    // Only update if different from current
    if (window.location.hash !== `#${newHash}`) {
      window.location.hash = newHash;
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateUrl(category, selectedType);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    updateUrl(selectedCategory, type);
  };

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
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aws-blue focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-aws-blue text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-aws-blue hover:shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Module Type Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Module Types</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', color: 'gray', count: typeCounts.all },
              { key: 'labs', label: 'Labs', color: 'blue', count: typeCounts.labs },
              { key: 'knowledge-checks', label: 'Knowledge Checks', color: 'green', count: typeCounts.knowledgeChecks },
              { key: 'exit-tickets', label: 'Exit Tickets', color: 'purple', count: typeCounts.exitTickets },
              { key: 'demonstrations', label: 'Demonstrations', color: 'yellow', count: typeCounts.demonstrations },
              { key: 'activities', label: 'Activities', color: 'indigo', count: typeCounts.activities }
            ].map(type => (
              <button
                key={type.key}
                onClick={() => handleTypeChange(type.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedType === type.key
                    ? `bg-${type.color}-500 text-white shadow-sm`
                    : `bg-white text-gray-700 border border-gray-200 hover:border-${type.color}-500 hover:shadow-sm`
                }`}
              >
                <span>{type.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedType === type.key 
                    ? 'bg-white bg-opacity-20' 
                    : `bg-${type.color}-100 text-${type.color}-800`
                }`}>
                  {type.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredModules.length} modules 
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {selectedType !== 'all' && ` • ${selectedType.replace('-', ' ')}`}
            {searchTerm && ` • matching "${searchTerm}"`}
          </p>
        </div>

        {/* Modules List */}
        <div className="space-y-3">
          {filteredModules.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-600">Try adjusting your filters or search term</p>
            </div>
          ) : (
            filteredModules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                isCompleted={!!progress[module.id]}
                onToggle={toggleModule}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};