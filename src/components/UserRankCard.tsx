import React from 'react';
import { LeaderboardEntry, UserStats } from '../types';
import { LeaderboardService } from '../services/leaderboardService';

interface UserRankCardProps {
  userEntry: LeaderboardEntry;
  totalUsers: number;
  userStats?: UserStats;
  className?: string;
}

export const UserRankCard: React.FC<UserRankCardProps> = ({
  userEntry,
  totalUsers,
  userStats,
  className = ''
}) => {
  const rankProgress = LeaderboardService.calculateRankProgress(userEntry.rank, totalUsers);
  const achievements = userStats ? LeaderboardService.getUserAchievements(userStats) : [];

  return (
    <div className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Your Ranking</h3>
          <p className="text-blue-100 text-sm">
            Among {totalUsers} students in the class
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{userEntry.rank}</div>
          <div className="text-blue-100 text-sm">Rank</div>
        </div>
      </div>

      {/* Progress to next rank */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-blue-100">Progress to next rank</span>
          <span className="font-semibold">{Math.round(rankProgress.progressToNext)}%</span>
        </div>
        <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${rankProgress.progressToNext}%` }}
          ></div>
        </div>
      </div>

      {/* User info and points */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {userEntry.photoURL ? (
            <img
              src={userEntry.photoURL}
              alt={userEntry.displayName}
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userEntry.displayName[0].toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold">{userEntry.displayName}</div>
            <div className="text-blue-100 text-sm">
              {userEntry.completedModules} modules completed
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{userEntry.totalPoints}</div>
          <div className="text-blue-100 text-sm">Total Points</div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mt-4 pt-4 border-t border-blue-400 border-opacity-30">
          <div className="text-sm font-semibold mb-2">Achievements</div>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white"
              >
                🏆 {achievement}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Points breakdown */}
      <div className="mt-4 pt-4 border-t border-blue-400 border-opacity-30">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold">{userEntry.completedKCs}</div>
            <div className="text-blue-100">Knowledge Checks</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{userEntry.completedLabs}</div>
            <div className="text-blue-100">Labs Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};