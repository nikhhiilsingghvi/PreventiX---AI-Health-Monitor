import React, { useState } from 'react';
import { useGamification } from './GamificationContext';
import { Trophy, Star, Target, Zap, TrendingUp, Award, Gift, Crown } from 'lucide-react';

const RewardsDisplay = () => {
  const { 
    userStats, 
    recentRewards, 
    getNextLevelInfo, 
    getEarnedBadges, 
    getEarnedAchievements 
  } = useGamification();
  
  const [showAllRewards, setShowAllRewards] = useState(false);
  
  const nextLevelInfo = getNextLevelInfo();
  const earnedBadges = getEarnedBadges();
  const earnedAchievements = getEarnedAchievements();

  const getRewardIcon = (type) => {
    switch (type) {
      case 'badge': return <Award className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
      case 'points': return <Star className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const getRewardColor = (type) => {
    switch (type) {
      case 'badge': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'achievement': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'points': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default: return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Rewards</h2>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Level {userStats.level}</span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress to Level {nextLevelInfo.nextLevel}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{nextLevelInfo.pointsNeeded} points to go</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${nextLevelInfo.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{userStats.totalPoints} points</span>
          <span>{nextLevelInfo.nextLevel * 1000} points</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">Total Points</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{userStats.totalPoints.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-semibold text-orange-900 dark:text-orange-200">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">{userStats.currentStreak} days</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-900 dark:text-green-200">Badges</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-200">{earnedBadges.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-900 dark:text-purple-200">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{earnedAchievements.length}</p>
        </div>
      </div>

      {/* Recent Rewards */}
      {recentRewards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Rewards</h3>
          <div className="space-y-3">
            {recentRewards.slice(0, showAllRewards ? recentRewards.length : 3).map((reward, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`p-2 rounded-lg ${getRewardColor(reward.type)}`}>
                  {getRewardIcon(reward.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reward.type === 'points' ? `+${reward.points} points` : reward.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reward.type === 'points' ? reward.reason : reward.description}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {reward.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          {recentRewards.length > 3 && (
            <button
              onClick={() => setShowAllRewards(!showAllRewards)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2"
            >
              {showAllRewards ? 'Show Less' : `Show All ${recentRewards.length} Rewards`}
            </button>
          )}
        </div>
      )}

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Earned Badges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 text-center">
                <div className="text-2xl mb-2">{badge.icon}</div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">{badge.name}</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">{badge.points} pts</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {earnedAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200">{achievement.name}</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsDisplay;

