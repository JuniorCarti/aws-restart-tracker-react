import React from 'react';
import { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  isCompleted: boolean;
  onToggle: (moduleId: number, completed: boolean) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isCompleted,
  onToggle
}) => {
  const getBadge = () => {
    if (module.isLab) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
          LAB
        </span>
      );
    }
    if (module.isKC) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200">
          KNOWLEDGE CHECK
        </span>
      );
    }
    if (module.isExitTicket) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-200">
          EXIT TICKET
        </span>
      );
    }
    if (module.isDemonstration) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
          DEMONSTRATION
        </span>
      );
    }
    if (module.isActivity) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200">
          ACTIVITY
        </span>
      );
    }
    return null;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Introduction': 'bg-blue-500',
      'Cloud Fundamentals': 'bg-green-500',
      'AWS Core Services': 'bg-purple-500',
      'Linux': 'bg-yellow-500',
      'Networking': 'bg-red-500',
      'Security': 'bg-pink-500',
      'Python Programming': 'bg-indigo-500',
      'Databases': 'bg-teal-500',
      'AWS Architecture': 'bg-orange-500',
      'Systems Operations': 'bg-cyan-500',
      'Exam Prep': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-400';
  };

  return (
    <div
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-gray-300'
      }`}
      onClick={() => onToggle(module.id, !isCompleted)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
              isCompleted
                ? 'bg-green-500 border-green-500'
                : 'bg-white border-gray-300'
            }`}
          >
            {isCompleted && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${getCategoryColor(module.category)}`}></span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {module.category}
              </span>
            </div>
            <h3
              className={`font-medium text-sm leading-relaxed ${
                isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
              }`}
            >
              {module.title}
            </h3>
            {module.subtitle && (
              <p className="text-xs text-gray-600 mt-1">{module.subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          {getBadge()}
          {isCompleted && (
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};