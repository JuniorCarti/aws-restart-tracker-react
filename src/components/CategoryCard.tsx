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
