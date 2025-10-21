import React from 'react';

interface CategoryCardProps {
  category: string;
  completed: number;
  total: number;
  progress: number;
  onTap: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  completed,
  total,
  progress,
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
      'Exam Prep': '📚'
    };
    return icons[cat] || '📁';
  };

  const abbreviateCategory = (cat: string): string => {
    const words = cat.split(' ');
    if (words.length <= 2) return cat;
    return words.slice(0, 2).join(' ');
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-orange-200"
      onClick={onTap}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg">
          {getCategoryIcon(category)}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{completed}</div>
          <div className="text-sm text-gray-500">of {total}</div>
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {abbreviateCategory(category)}
      </h3>
      
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        {Math.round(progress * 100)}% complete
      </div>
    </div>
  );
};