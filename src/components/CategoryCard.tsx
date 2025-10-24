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
