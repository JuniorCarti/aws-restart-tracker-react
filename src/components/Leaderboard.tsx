import React from 'react';
import { LeaderboardEntry, UserStats } from '../types';
import { DataService } from '../services/dataService';

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
  onUserClick?: (userId: string) => void;
  showHeader?: boolean;
  limit?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboard,
  currentUserId,
  onUserClick,
  showHeader = true,
  limit
}) => {
  const displayLeaderboard = limit ? leaderboard.slice(0, limit) : leaderboard;

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank.toString();
    }
  };

  const formatPoints = (points: number) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}k`;
    }
    return points.toString();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {showHeader && (
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-xl font-bold text-gray-900">Class Leaderboard</h3>
          <p className="text-gray-600 mt-1 text-sm">
            Track your progress and compete with classmates
          </p>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {displayLeaderboard.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-3">📊</div>
            <p className="text-gray-600">No leaderboard data available yet.</p>
            <p className="text-sm text-gray-500 mt-1">
              Complete some modules to appear on the leaderboard!
            </p>
          </div>
        ) : (
          displayLeaderboard.map((entry, index) => (
            <div
              key={entry.uid}
              className={`p-4 flex items-center justify-between transition-all duration-200 hover:bg-gray-50 ${
                currentUserId && entry.uid === currentUserId
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : ''
              }`}
              onClick={() => onUserClick?.(entry.uid)}
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Rank */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 ${getRankColor(entry.rank)}`}>
                  <span className="text-lg">{getRankIcon(entry.rank)}</span>
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  {entry.photoURL ? (
                    <img
                      src={entry.photoURL}
                      alt={entry.displayName}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {entry.displayName[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {entry.displayName}
                    </h4>
                    {currentUserId && entry.uid === currentUserId && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>{entry.completedKCs} KCs</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>{entry.completedLabs} Labs</span>
                    </span>
                    <span>{entry.completedModules} modules</span>
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPoints(entry.totalPoints)}
                </div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with points legend */}
      {showHeader && displayLeaderboard.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-center space-x-6 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>KC = {DataService.POINTS_SYSTEM.knowledgeChecks}pts</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Lab = {DataService.POINTS_SYSTEM.labs}pt</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Exit = {DataService.POINTS_SYSTEM.exitTickets}pts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};