import React from 'react';

interface CategoryCardProps {
  category: string;
  completed: number;
  total: number;
  progress: number;
  typeStats?: {
    labs: number;
    knowledgeChecks: number;
    exitTickets: number;
    demonstrations: number;
    activities: number;
  };
  onTap: () => void;
}
export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  completed,
  total,
  progress,
  typeStats,
  onTap
}) => {
  const getCategoryIcon = (cat: string): string => {
    const icons: { [key: string]: string } = {
      'Introduction': '🚀',
      'Cloud Fundamentals': '☁️',
      'AWS Core Services': '⚙️',
      'Linux': '🐧',
      'Networking': '🌐',
      'Security': '🔒',
      'Python Programming': '🐍',
      'Databases': '💾',
      'AWS Architecture': '🏗️',
      'Systems Operations': '🛠️',
      'Exam Prep': '📚',
      'AWS Advanced Skills: Artificial Intelligence': '🤖'
    };
    return icons[cat] || '📁';
  };
  const getCategoryColor = (cat: string): string => {
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
      'Exam Prep': 'bg-gray-500',
      'AWS Advanced Skills: Artificial Intelligence': 'bg-purple-500'
    };
    return colors[cat] || 'bg-gray-400';
  };

  const abbreviateCategory = (cat: string): string => {
    const words = cat.split(' ');
    if (words.length <= 2) return cat;
    return words.slice(0, 2).join(' ');
  };
  const getTypeProgressBars = () => {
    if (!typeStats) return null;

    const types = [
      { key: 'labs', label: 'L', color: 'bg-blue-500', count: typeStats.labs },
      { key: 'knowledgeChecks', label: 'KC', color: 'bg-green-500', count: typeStats.knowledgeChecks },
      { key: 'exitTickets', label: 'ET', color: 'bg-purple-500', count: typeStats.exitTickets },
      { key: 'demonstrations', label: 'D', color: 'bg-yellow-500', count: typeStats.demonstrations },
      { key: 'activities', label: 'A', color: 'bg-indigo-500', count: typeStats.activities }
    ];

    return (
      <div className="flex items-center justify-between space-x-1 mt-3">
        {types.map(type => (
          <div key={type.key} className="flex-1 text-center" title={`${type.label}: ${type.count}`}>
            <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${type.color}`}></div>
            <div className="text-xs font-medium text-gray-700">{type.count}</div>
          </div>
        ))}
      </div>
    );
  };
