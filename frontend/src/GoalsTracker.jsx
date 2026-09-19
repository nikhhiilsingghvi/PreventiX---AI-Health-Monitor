import React, { useState } from 'react';
import { useGamification } from './GamificationContext';
import { Target, CheckCircle, Clock, TrendingUp, Award, Zap } from 'lucide-react';

const GoalsTracker = () => {
  const { 
    userStats, 
    completeGoal, 
    getGoalProgress, 
    addPoints 
  } = useGamification();
  
  const [selectedGoal, setSelectedGoal] = useState(null);

  const goals = [
    {
      id: 'exercise',
      name: 'Exercise',
      icon: '🏃‍♂️',
      description: 'Complete 150 minutes of exercise this week',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      textColor: 'text-blue-900 dark:text-blue-200',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'nutrition',
      name: 'Nutrition',
      icon: '🥗',
      description: 'Track your meals for 7 days',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      textColor: 'text-green-900 dark:text-green-200',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'sleep',
      name: 'Sleep',
      icon: '😴',
      description: 'Track your sleep for 7 days',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      textColor: 'text-purple-900 dark:text-purple-200',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'assessments',
      name: 'Health Assessment',
      icon: '🏥',
      description: 'Complete a health assessment',
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      textColor: 'text-red-900 dark:text-red-200',
      iconColor: 'text-red-600 dark:text-red-400'
    }
  ];

  const handleCompleteGoal = (goalId) => {
    completeGoal(goalId);
    setSelectedGoal(goalId);
    setTimeout(() => setSelectedGoal(null), 2000);
  };

  const getWeeklyProgress = () => {
    const totalGoals = Object.keys(userStats.weeklyGoals).length;
    const completedGoals = Object.values(userStats.weeklyGoals).filter(goal => goal.completed >= goal.target).length;
    return {
      completed: completedGoals,
      total: totalGoals,
      percentage: (completedGoals / totalGoals) * 100
    };
  };

  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Goals</h2>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {weeklyProgress.completed}/{weeklyProgress.total} Complete
          </span>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Progress</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(weeklyProgress.percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${weeklyProgress.percentage}%` }}
          ></div>
        </div>
        {weeklyProgress.percentage === 100 && (
          <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">Perfect Week! +500 bonus points!</span>
          </div>
        )}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const progress = getGoalProgress(goal.id);
          const isCompleted = progress.completed >= progress.target;
          const isSelected = selectedGoal === goal.id;

          return (
            <div 
              key={goal.id}
              className={`relative bg-gradient-to-br ${goal.bgColor} rounded-xl p-4 border-2 transition-all duration-300 ${
                isCompleted 
                  ? 'border-green-300 dark:border-green-700 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
              } ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
            >
              {/* Completion Badge */}
              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              )}

              {/* Goal Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{goal.icon}</div>
                <div>
                  <h3 className={`font-semibold ${goal.textColor}`}>{goal.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {progress.completed}/{progress.target}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {progress.points} pts
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${goal.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              {!isCompleted ? (
                <button
                  onClick={() => handleCompleteGoal(goal.id)}
                  disabled={progress.completed >= progress.target}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                    progress.completed >= progress.target
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : `bg-gradient-to-r ${goal.color} text-white hover:shadow-lg transform hover:scale-105`
                  }`}
                >
                  {progress.completed >= progress.target ? 'Completed!' : `Complete (+${progress.points} pts)`}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Completed!</span>
                </div>
              )}

              {/* Completion Animation */}
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Zap className="w-5 h-5 animate-bounce" />
                    <span className="font-semibold">+{progress.points} points earned!</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Summary</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {weeklyProgress.percentage === 100 
            ? "🎉 Congratulations! You've completed all your weekly goals. Keep up the great work!"
            : `You're ${Math.round(weeklyProgress.percentage)}% of the way to completing all your weekly goals. Keep going!`
          }
        </p>
        {weeklyProgress.percentage > 0 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Earned {Object.values(userStats.weeklyGoals).reduce((total, goal) => total + (goal.completed * goal.points), 0)} points this week
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsTracker;

