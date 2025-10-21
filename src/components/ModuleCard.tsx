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
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">LAB</span>;
    }
    if (module.isKC) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">KC</span>;
    }
    return null;
  };

  return (
    <div
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-100'
      }`}
      onClick={() => onToggle(module.id, !isCompleted)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
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
          <div className="flex-1">
            <h3
              className={`font-medium ${
                isCompleted ? 'text-green-700 line-through' : 'text-gray-900'
              }`}
            >
              {module.title}
            </h3>
            {module.subtitle && (
              <p className="text-sm text-gray-600 mt-1">{module.subtitle}</p>
            )}
          </div>
        </div>
        {getBadge()}
      </div>
    </div>
  );
};