import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { ProgressService } from '../services/progressService';
import { FirestoreService } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';
import { Module, CategoryStats, LeaderboardEntry, UserStats } from '../types';

export const Stats: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<{ [key: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'analytics' | 'leaderboard'>('analytics');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<{ userEntry: LeaderboardEntry | null; surroundingEntries: LeaderboardEntry[]; totalUsers: number } | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'leaderboard' && currentUser) {
      loadLeaderboard();
    }
  }, [activeTab, currentUser]);

  const loadData = async () => {
    const allModules = DataService.getAllModules();
    const userProgress = await ProgressService.getProgress();
    setModules(allModules);
    setProgress(userProgress);
    
    // Calculate user stats for points
    const stats = DataService.calculateUserPoints(allModules, userProgress);
    setUserStats(stats);
  };

  const loadLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const leaderboardData = await FirestoreService.getLeaderboard(20);
      setLeaderboard(leaderboardData);

      if (currentUser) {
        const rankData = await FirestoreService.getUserRank(currentUser.uid);
        setUserRank(rankData);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.hash = '#/';
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navigateTo = (path: string) => {
    window.location.hash = path;
  };

  const totalCompleted = DataService.getTotalCompleted(progress);
  const overallProgress = DataService.getOverallProgress(modules, progress);
  const categoryStats = DataService.getCategoryStats(modules, progress);

  // Calculate additional stats
  const completedPercentage = Math.round(overallProgress * 100);
  const remainingModules = modules.length - totalCompleted;

  // Calculate user points breakdown
  const pointsBreakdown = userStats ? DataService.getPointsBreakdown(modules, progress) : null;
  const totalPossiblePoints = DataService.getTotalPossiblePoints();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              {currentUser && (
                <p className="text-sm text-gray-600">
                  {currentUser.displayName || currentUser.email}'s Learning Progress
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* User Info */}
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {currentUser.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateTo('/login')}
                    className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigateTo('/signup')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              <button
                onClick={() => window.history.back()}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Personal Analytics
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leaderboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leaderboard
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analytics' ? (
          <>
            {/* User Welcome Message */}
            {currentUser && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-blue-900">
                  Your Learning Analytics{currentUser.displayName ? `, ${currentUser.displayName}` : ''}
                </h2>
                <p className="text-blue-700 text-sm">
                  Track your progress and identify areas for improvement.
                </p>
              </div>
            )}

            {/* Overall Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
                {!currentUser && (
                  <button
                    onClick={() => navigateTo('/signup')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Sign up to save progress →
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{totalCompleted}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">
                    {remainingModules}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{modules.length}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {userStats?.totalPoints || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgress * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0%</span>
                  <span className="font-semibold">{completedPercentage}% Complete</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Points Breakdown */}
            {userStats && pointsBreakdown && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Points Breakdown</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {pointsBreakdown.knowledgeChecks}
                    </div>
                    <div className="text-sm text-blue-800">KC Points</div>
                    <div className="text-xs text-gray-600">{userStats.completedKCs} completed</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {pointsBreakdown.labs}
                    </div>
                    <div className="text-sm text-green-800">Lab Points</div>
                    <div className="text-xs text-gray-600">{userStats.completedLabs} completed</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {pointsBreakdown.exitTickets}
                    </div>
                    <div className="text-sm text-purple-800">Exit Ticket Points</div>
                    <div className="text-xs text-gray-600">{userStats.completedExitTickets} completed</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {pointsBreakdown.demonstrations}
                    </div>
                    <div className="text-sm text-yellow-800">Demo Points</div>
                    <div className="text-xs text-gray-600">{userStats.completedDemonstrations} completed</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">
                      {pointsBreakdown.activities}
                    </div>
                    <div className="text-sm text-indigo-800">Activity Points</div>
                    <div className="text-xs text-gray-600">{userStats.completedActivities} completed</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Points</span>
                    <span className="text-lg font-bold text-gray-900">{userStats.totalPoints} / {totalPossiblePoints}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(userStats.totalPoints / totalPossiblePoints) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Stats for Authenticated Users */}
            {currentUser && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Insights</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((totalCompleted / modules.length) * 100)}%
                    </div>
                    <div className="text-sm text-blue-800">Overall Completion</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.keys(categoryStats).length}
                    </div>
                    <div className="text-sm text-green-800">Categories</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {modules.filter(m => m.isLab).length}
                    </div>
                    <div className="text-sm text-purple-800">Total Labs</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="text-sm text-orange-800">Last Active</div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Category Breakdown</h2>
                {!currentUser && (
                  <button
                    onClick={() => navigateTo('/signup')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Sign up for detailed analytics →
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, completedCount]) => {
                  const categoryModules = modules.filter(m => m.category === category).length;
                  const percentage = categoryModules > 0 ? (completedCount / categoryModules) * 100 : 0;
                  const isComplete = percentage === 100;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-900">{category}</span>
                          <span className={`font-medium ${
                            isComplete ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {completedCount}/{categoryModules} ({Math.round(percentage)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: isComplete ? '#10B981' : 
                                            percentage >= 50 ? '#F59E0B' : 
                                            '#EF4444'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {!currentUser && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    <button 
                      onClick={() => navigateTo('/signup')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Create an account
                    </button> to unlock advanced analytics, progress tracking, and personalized insights
                  </p>
                </div>
              )}
            </div>

            {/* Call to Action for Guest Users */}
            {!currentUser && (
              <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-center text-white">
                <h3 className="text-xl font-bold mb-2">Ready to level up your learning?</h3>
                <p className="mb-4 opacity-90">
                  Join thousands of students tracking their AWS journey with personalized insights
                </p>
                <button
                  onClick={() => navigateTo('/signup')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Your Free Account
                </button>
              </div>
            )}
          </>
        ) : (
          /* LEADERBOARD TAB */
          <div className="space-y-6">
            {/* Leaderboard Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Leaderboard</h2>
              <p className="text-gray-600">
                Compete with your classmates and track your progress through the AWS RESTART program.
                Earn points by completing modules!
              </p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">Knowledge Checks</div>
                  <div className="text-gray-700">{DataService.POINTS_SYSTEM.knowledgeChecks} pts each</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">Labs</div>
                  <div className="text-gray-700">{DataService.POINTS_SYSTEM.labs} pt each</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">Exit Tickets</div>
                  <div className="text-gray-700">{DataService.POINTS_SYSTEM.exitTickets} pts each</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-yellow-600">Activities</div>
                  <div className="text-gray-700">{DataService.POINTS_SYSTEM.activities} pts each</div>
                </div>
              </div>
            </div>

            {/* User Rank Card */}
            {currentUser && userRank?.userEntry && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Your Ranking</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold">{userRank.userEntry.rank}</div>
                    <div>
                      <div className="font-semibold">{userRank.userEntry.displayName}</div>
                      <div className="text-blue-100 text-sm">
                        {userRank.userEntry.totalPoints} points • {userRank.userEntry.completedModules} modules
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{userRank.userEntry.totalPoints}</div>
                    <div className="text-blue-100 text-sm">Total Points</div>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Top Performers</h3>
              </div>
              
              {loadingLeaderboard ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading leaderboard...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No leaderboard data available yet.</p>
                  <p className="text-sm text-gray-500 mt-1">Complete some modules to appear on the leaderboard!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={entry.uid}
                      className={`p-4 flex items-center justify-between ${
                        currentUser && entry.uid === currentUser.uid 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.rank === 1 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : entry.rank === 2
                            ? 'bg-gray-100 text-gray-800'
                            : entry.rank === 3
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-50 text-gray-600'
                        }`}>
                          {entry.rank}
                        </div>
                        
                        {/* Avatar */}
                        {entry.photoURL ? (
                          <img
                            src={entry.photoURL}
                            alt={entry.displayName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {entry.displayName[0].toUpperCase()}
                          </div>
                        )}
                        
                        {/* User Info */}
                        <div>
                          <div className="font-medium text-gray-900">
                            {entry.displayName}
                            {currentUser && entry.uid === currentUser.uid && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entry.completedModules} modules • {entry.totalPoints} points
                          </div>
                        </div>
                      </div>
                      
                      {/* Points Breakdown */}
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{entry.totalPoints}</div>
                        <div className="text-xs text-gray-500 space-x-1">
                          <span className="text-blue-600">{entry.completedKCs} KCs</span>
                          <span>•</span>
                          <span className="text-green-600">{entry.completedLabs} Labs</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leaderboard Call to Action */}
            {!currentUser && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-center text-white">
                <h3 className="text-xl font-bold mb-2">Join the Competition!</h3>
                <p className="mb-4 opacity-90">
                  Sign up to track your progress, earn points, and compete with your classmates on the leaderboard.
                </p>
                <button
                  onClick={() => navigateTo('/signup')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Sign Up to Compete
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};