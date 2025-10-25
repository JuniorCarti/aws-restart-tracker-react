import { DataService } from './dataService';
import { FirestoreService } from './firestoreService';
import { LeaderboardEntry, UserStats, LeaderboardFilters } from '../types';

export class LeaderboardService {
  // Get enhanced leaderboard with additional statistics
  static async getEnhancedLeaderboard(limitCount: number = 20): Promise<LeaderboardEntry[]> {
    try {
      const leaderboard = await FirestoreService.getLeaderboard(limitCount);
      
      // Add additional calculated fields
      return leaderboard.map(entry => ({
        ...entry,
        kcPoints: entry.completedKCs * DataService.POINTS_SYSTEM.knowledgeChecks,
        labPoints: entry.completedLabs * DataService.POINTS_SYSTEM.labs,
        exitTicketPoints: entry.completedExitTickets * DataService.POINTS_SYSTEM.exitTickets,
        demoPoints: entry.completedDemonstrations * DataService.POINTS_SYSTEM.demonstrations,
        activityPoints: entry.completedActivities * DataService.POINTS_SYSTEM.activities,
      }));
    } catch (error) {
      console.error('Error getting enhanced leaderboard:', error);
      throw error;
    }
  }

  // Get leaderboard with filters
  static async getFilteredLeaderboard(filters: LeaderboardFilters, limitCount: number = 20): Promise<LeaderboardEntry[]> {
    try {
      let leaderboard = await FirestoreService.getLeaderboard(100); // Get more for filtering
      
      // Apply time-based filters
      if (filters.timeRange !== 'all-time') {
        const cutoffDate = new Date();
        
        switch (filters.timeRange) {
          case 'weekly':
            cutoffDate.setDate(cutoffDate.getDate() - 7);
            break;
          case 'monthly':
            cutoffDate.setMonth(cutoffDate.getMonth() - 1);
            break;
        }
        
        leaderboard = leaderboard.filter(entry => 
          new Date(entry.lastActive) >= cutoffDate
        );
      }

      // Apply ranking after filtering
      leaderboard = leaderboard
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, limitCount)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));

      return leaderboard;
    } catch (error) {
      console.error('Error getting filtered leaderboard:', error);
      throw error;
    }
  }

  // Calculate user's progress towards next rank
  static calculateRankProgress(currentRank: number, totalUsers: number): {
    currentRank: number;
    totalUsers: number;
    progressToNext: number;
    pointsToNext?: number;
  } {
    if (currentRank === 1) {
      return { currentRank, totalUsers, progressToNext: 100 };
    }

    const progressToNext = ((totalUsers - currentRank + 1) / totalUsers) * 100;
    return { currentRank, totalUsers, progressToNext };
  }

  // Get achievement badges based on user stats
  static getUserAchievements(userStats: UserStats): string[] {
    const achievements: string[] = [];

    if (userStats.completedKCs >= 10) {
      achievements.push('KC Master');
    }
    if (userStats.completedLabs >= 5) {
      achievements.push('Lab Expert');
    }
    if (userStats.totalPoints >= 1000) {
      achievements.push('Points Pioneer');
    }
    if (userStats.completedModules >= 50) {
      achievements.push('Module Marathoner');
    }
    if (userStats.completedKCs >= 5 && userStats.completedLabs >= 3) {
      achievements.push('Balanced Learner');
    }

    return achievements;
  }

  // Calculate streak information
  static calculateStreak(completionDates: Date[]): {
    currentStreak: number;
    longestStreak: number;
    lastActive: Date | null;
  } {
    if (completionDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastActive: null };
    }

    // Sort dates in descending order
    const sortedDates = [...completionDates].sort((a, b) => b.getTime() - a.getTime());
    const lastActive = sortedDates[0];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const previousDate = sortedDates[i - 1];
      
      // Check if dates are consecutive (within 2 days to account for timezone issues)
      const dayDiff = Math.floor(
        (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff <= 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calculate current streak (most recent consecutive days)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let streakCount = 0;
    let checkDate = new Date(lastActive);
    
    while (sortedDates.some(date => 
      date.toDateString() === checkDate.toDateString()
    )) {
      streakCount++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    currentStreak = streakCount;

    return { currentStreak, longestStreak, lastActive };
  }

  // Get leaderboard statistics
  static getLeaderboardStats(leaderboard: LeaderboardEntry[]): {
    averagePoints: number;
    topScore: number;
    activeUsers: number;
    totalPoints: number;
  } {
    if (leaderboard.length === 0) {
      return { averagePoints: 0, topScore: 0, activeUsers: 0, totalPoints: 0 };
    }

    const totalPoints = leaderboard.reduce((sum, entry) => sum + entry.totalPoints, 0);
    const averagePoints = Math.round(totalPoints / leaderboard.length);
    const topScore = Math.max(...leaderboard.map(entry => entry.totalPoints));
    
    // Consider users active if they've been active in the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeUsers = leaderboard.filter(entry => 
      new Date(entry.lastActive) >= weekAgo
    ).length;

    return { averagePoints, topScore, activeUsers, totalPoints };
  }
}