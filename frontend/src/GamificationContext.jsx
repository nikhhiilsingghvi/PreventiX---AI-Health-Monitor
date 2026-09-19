import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { trackingAPI } from './api';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    achievements: [],
    weeklyGoals: {
      exercise: { target: 150, completed: 0, points: 50 },
      nutrition: { target: 7, completed: 0, points: 30 },
      sleep: { target: 7, completed: 0, points: 40 },
      assessments: { target: 1, completed: 0, points: 100 }
    }
  });

  const [recentRewards, setRecentRewards] = useState([]);

  // Badge definitions
  const badgeDefinitions = {
    first_assessment: {
      id: 'first_assessment',
      name: 'Health Explorer',
      description: 'Complete your first health assessment',
      icon: '🏥',
      points: 100,
      condition: (stats) => stats.assessments > 0
    },
    streak_7: {
      id: 'streak_7',
      name: 'Consistent Tracker',
      description: 'Maintain a 7-day tracking streak',
      icon: '🔥',
      points: 200,
      condition: (stats) => stats.currentStreak >= 7
    },
    streak_30: {
      id: 'streak_30',
      name: 'Health Champion',
      description: 'Maintain a 30-day tracking streak',
      icon: '👑',
      points: 500,
      condition: (stats) => stats.currentStreak >= 30
    },
    exercise_master: {
      id: 'exercise_master',
      name: 'Fitness Enthusiast',
      description: 'Complete 150 minutes of exercise in a week',
      icon: '💪',
      points: 150,
      condition: (stats) => stats.weeklyGoals.exercise.completed >= stats.weeklyGoals.exercise.target
    },
    nutrition_expert: {
      id: 'nutrition_expert',
      name: 'Nutrition Pro',
      description: 'Track nutrition for 7 consecutive days',
      icon: '🥗',
      points: 120,
      condition: (stats) => stats.weeklyGoals.nutrition.completed >= stats.weeklyGoals.nutrition.target
    },
    sleep_guru: {
      id: 'sleep_guru',
      name: 'Sleep Master',
      description: 'Track sleep for 7 consecutive days',
      icon: '😴',
      points: 100,
      condition: (stats) => stats.weeklyGoals.sleep.completed >= stats.weeklyGoals.sleep.target
    },
    risk_reducer: {
      id: 'risk_reducer',
      name: 'Risk Reducer',
      description: 'Improve your health risk scores',
      icon: '📉',
      points: 300,
      condition: (stats) => stats.riskImprovement > 0
    },
    perfect_week: {
      id: 'perfect_week',
      name: 'Perfect Week',
      description: 'Complete all weekly goals',
      icon: '⭐',
      points: 500,
      condition: (stats) => 
        stats.weeklyGoals.exercise.completed >= stats.weeklyGoals.exercise.target &&
        stats.weeklyGoals.nutrition.completed >= stats.weeklyGoals.nutrition.target &&
        stats.weeklyGoals.sleep.completed >= stats.weeklyGoals.sleep.target
    }
  };

  // Achievement definitions
  const achievementDefinitions = {
    points_1000: {
      id: 'points_1000',
      name: 'Point Collector',
      description: 'Earn 1,000 total points',
      icon: '🎯',
      points: 0,
      condition: (stats) => stats.totalPoints >= 1000
    },
    points_5000: {
      id: 'points_5000',
      name: 'Point Master',
      description: 'Earn 5,000 total points',
      icon: '🏆',
      points: 0,
      condition: (stats) => stats.totalPoints >= 5000
    },
    level_5: {
      id: 'level_5',
      name: 'Health Expert',
      description: 'Reach level 5',
      icon: '🎖️',
      points: 0,
      condition: (stats) => stats.level >= 5
    },
    level_10: {
      id: 'level_10',
      name: 'Health Legend',
      description: 'Reach level 10',
      icon: '🌟',
      points: 0,
      condition: (stats) => stats.level >= 10
    }
  };

  // Calculate level based on points
  const calculateLevel = (points) => {
    return Math.floor(points / 1000) + 1;
  };

  // Check for new badges and achievements
  const checkRewards = (newStats) => {
    const newBadges = [];
    const newAchievements = [];

    // Check badges
    Object.values(badgeDefinitions).forEach(badge => {
      if (!newStats.badges.includes(badge.id) && badge.condition(newStats)) {
        newBadges.push(badge);
        newStats.totalPoints += badge.points;
      }
    });

    // Check achievements
    Object.values(achievementDefinitions).forEach(achievement => {
      if (!newStats.achievements.includes(achievement.id) && achievement.condition(newStats)) {
        newAchievements.push(achievement);
      }
    });

    return { newBadges, newAchievements };
  };

  // Add points and check for rewards
  const addPoints = useCallback((points, reason, category = 'general') => {
    setUserStats(prevStats => {
      const newStats = {
        ...prevStats,
        totalPoints: prevStats.totalPoints + points,
        level: calculateLevel(prevStats.totalPoints + points)
      };

      const { newBadges, newAchievements } = checkRewards(newStats);

      if (newBadges.length > 0 || newAchievements.length > 0) {
        const newRewards = [
          ...newBadges.map(badge => ({ type: 'badge', ...badge, timestamp: new Date() })),
          ...newAchievements.map(achievement => ({ type: 'achievement', ...achievement, timestamp: new Date() }))
        ];

        setRecentRewards(prev => [...newRewards, ...prev.slice(0, 4)]); // Keep last 5 rewards

        newStats.badges = [...newStats.badges, ...newBadges.map(b => b.id)];
        newStats.achievements = [...newStats.achievements, ...newAchievements.map(a => a.id)];
      }

      return newStats;
    });

    // Add to recent rewards
    setRecentRewards(prev => [
      { type: 'points', points, reason, category, timestamp: new Date() },
      ...prev.slice(0, 4)
    ]);
  }, []);

  // Complete a goal
  const completeGoal = useCallback((goalType) => {
    setUserStats(prevStats => {
      const newStats = { ...prevStats };
      const goal = newStats.weeklyGoals[goalType];
      
      if (goal && goal.completed < goal.target) {
        goal.completed += 1;
        addPoints(goal.points, `Completed ${goalType} goal`, 'goal');
      }

      return newStats;
    });
  }, [addPoints]);

  // Update streak
  const updateStreak = useCallback((increment = true) => {
    setUserStats(prevStats => {
      const newStreak = increment ? prevStats.currentStreak + 1 : 0;
      return {
        ...prevStats,
        currentStreak: newStreak,
        longestStreak: Math.max(prevStats.longestStreak, newStreak)
      };
    });
  }, []);

  // Reset weekly goals
  const resetWeeklyGoals = () => {
    setUserStats(prevStats => ({
      ...prevStats,
      weeklyGoals: {
        exercise: { target: 150, completed: 0, points: 50 },
        nutrition: { target: 7, completed: 0, points: 30 },
        sleep: { target: 7, completed: 0, points: 40 },
        assessments: { target: 1, completed: 0, points: 100 }
      }
    }));
  };

  // Get progress for a goal
  const getGoalProgress = (goalType) => {
    const goal = userStats.weeklyGoals[goalType];
    return {
      completed: goal.completed,
      target: goal.target,
      percentage: Math.min((goal.completed / goal.target) * 100, 100),
      points: goal.points
    };
  };

  // Get next level requirements
  const getNextLevelInfo = () => {
    const currentLevelPoints = (userStats.level - 1) * 1000;
    const nextLevelPoints = userStats.level * 1000;
    const pointsNeeded = nextLevelPoints - userStats.totalPoints;
    const progress = ((userStats.totalPoints - currentLevelPoints) / 1000) * 100;

    return {
      currentLevel: userStats.level,
      nextLevel: userStats.level + 1,
      pointsNeeded,
      progress: Math.min(progress, 100)
    };
  };

  // Get earned badges
  const getEarnedBadges = () => {
    return userStats.badges.map(badgeId => badgeDefinitions[badgeId]).filter(Boolean);
  };

  // Get earned achievements
  const getEarnedAchievements = () => {
    return userStats.achievements.map(achievementId => achievementDefinitions[achievementId]).filter(Boolean);
  };

  const value = {
    userStats,
    recentRewards,
    addPoints,
    completeGoal,
    updateStreak,
    resetWeeklyGoals,
    getGoalProgress,
    getNextLevelInfo,
    getEarnedBadges,
    getEarnedAchievements,
    badgeDefinitions,
    achievementDefinitions
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
