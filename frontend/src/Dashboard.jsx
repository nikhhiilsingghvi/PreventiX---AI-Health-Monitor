import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useGamification } from './GamificationContext';
import SettingsModal from './SettingsModal';
import RecentAssessments from './RecentAssessments';
import RewardsDisplay from './RewardsDisplay';
import GoalsTracker from './GoalsTracker';
import { recentAssessments } from './api';
import { Heart, Activity, TrendingUp, Calendar, User, LogOut, BarChart3, Bell, Settings, Plus, ChevronRight, Droplet, Zap, Trophy, Target } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { addPoints, completeGoal, updateStreak } = useGamification();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    diabetesRisk: 0,
    hypertensionRisk: 0,
    metabolicScore: 0,
    cardiovascularScore: 0,
    diabetesImprovement: 0,
    hypertensionImprovement: 0,
    metabolicImprovement: 0,
    cardiovascularImprovement: 0
  });

  // Fetch assessments data
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const data = await recentAssessments.getRecent(10); // Get last 10 assessments
        setAssessments(data);
        
        if (data.length > 0) {
          calculateStats(data);
          // Award points for assessment completion (only once per session)
          const hasAwardedPoints = sessionStorage.getItem('dashboardPointsAwarded');
          if (!hasAwardedPoints) {
            addPoints(100, 'Completed health assessment', 'assessment');
            completeGoal('assessments');
            updateStreak();
            sessionStorage.setItem('dashboardPointsAwarded', 'true');
          }
        }
      } catch (error) {
        console.error('Failed to fetch assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []); // Remove dependencies to prevent infinite loop

  const calculateStats = (assessmentData) => {
    if (assessmentData.length === 0) return;

    // Get latest assessment
    const latest = assessmentData[0];
    
    // Calculate improvements (compare with previous assessment)
    const previous = assessmentData.length > 1 ? assessmentData[1] : null;
    
    const newStats = {
      diabetesRisk: latest.diabetes_risk / 100, // Convert percentage to decimal
      hypertensionRisk: latest.hypertension_risk / 100,
      metabolicScore: latest.metabolic_health_score || 0,
      cardiovascularScore: latest.cardiovascular_health_score || 0,
      diabetesImprovement: previous ? 
        ((previous.diabetes_risk - latest.diabetes_risk) / previous.diabetes_risk * 100) : 0,
      hypertensionImprovement: previous ? 
        ((previous.hypertension_risk - latest.hypertension_risk) / previous.hypertension_risk * 100) : 0,
      metabolicImprovement: previous ? 
        ((latest.metabolic_health_score - (previous.metabolic_health_score || 0)) / (previous.metabolic_health_score || 1) * 100) : 0,
      cardiovascularImprovement: previous ? 
        ((latest.cardiovascular_health_score - (previous.cardiovascular_health_score || 0)) / (previous.cardiovascular_health_score || 1) * 100) : 0
    };

    setStats(newStats);
  };

  const recommendations = [
    { category: 'Nutrition', text: 'Increase fiber intake to 25-30g daily', priority: 'high' },
    { category: 'Fitness', text: 'Aim for 150 minutes of moderate exercise weekly', priority: 'medium' },
    { category: 'Lifestyle', text: 'Maintain consistent sleep schedule (7-9 hours)', priority: 'medium' }
  ];

  const getRiskColor = (risk) => {
    if (risk < 0.25) return 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400';
    if (risk < 0.5) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (risk < 0.75) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400';
    return 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400';
  };

  const getRiskLabel = (risk) => {
    if (risk < 0.25) return 'Low Risk';
    if (risk < 0.5) return 'Moderate Risk';
    if (risk < 0.75) return 'High Risk';
    return 'Very High Risk';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">PreventiX</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {assessments.length > 0 
              ? "Here's your personalized health summary" 
              : "Complete your first health assessment to see personalized insights"
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getRiskColor(stats.diabetesRisk)}`}>
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">DIABETES</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {(stats.diabetesRisk * 100).toFixed(0)}%
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{getRiskLabel(stats.diabetesRisk)}</p>
            <div className="mt-3 flex items-center text-xs">
              {stats.diabetesImprovement > 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{stats.diabetesImprovement.toFixed(1)}% improvement</span>
                </div>
              ) : stats.diabetesImprovement < 0 ? (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  <span>{Math.abs(stats.diabetesImprovement).toFixed(1)}% increase</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span>No change</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${getRiskColor(stats.hypertensionRisk)}`}>
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">HYPERTENSION</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {(stats.hypertensionRisk * 100).toFixed(0)}%
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{getRiskLabel(stats.hypertensionRisk)}</p>
            <div className="mt-3 flex items-center text-xs">
              {stats.hypertensionImprovement > 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{stats.hypertensionImprovement.toFixed(1)}% improvement</span>
                </div>
              ) : stats.hypertensionImprovement < 0 ? (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  <span>{Math.abs(stats.hypertensionImprovement).toFixed(1)}% increase</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span>No change</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">METABOLIC</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.metabolicScore}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Health Score</p>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${stats.metabolicScore}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              {stats.metabolicImprovement > 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{stats.metabolicImprovement.toFixed(1)}% improvement</span>
                </div>
              ) : stats.metabolicImprovement < 0 ? (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  <span>{Math.abs(stats.metabolicImprovement).toFixed(1)}% decrease</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span>No change</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">CARDIOVASCULAR</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.cardiovascularScore}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Health Score</p>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${stats.cardiovascularScore}%` }}
              ></div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              {stats.cardiovascularImprovement > 0 ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{stats.cardiovascularImprovement.toFixed(1)}% improvement</span>
                </div>
              ) : stats.cardiovascularImprovement < 0 ? (
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  <span>{Math.abs(stats.cardiovascularImprovement).toFixed(1)}% decrease</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span>No change</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Insights & Action Items */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Health Insights & Action Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Risk Assessment Summary */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                  <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h4 className="font-semibold text-red-900 dark:text-red-200">Risk Assessment</h4>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                {stats.diabetesRisk > 0.5 || stats.hypertensionRisk > 0.5 
                  ? "High risk detected in key areas. Immediate attention recommended."
                  : stats.diabetesRisk > 0.25 || stats.hypertensionRisk > 0.25
                  ? "Moderate risk levels. Preventive measures advised."
                  : "Low risk levels. Maintain current healthy habits."
                }
              </p>
              <button 
                onClick={() => navigate('/assessment')}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                Take Action
              </button>
            </div>

            {/* Health Score Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-200">Health Scores</h4>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                {stats.metabolicScore > 80 && stats.cardiovascularScore > 80
                  ? "Excellent health scores! Keep up the great work."
                  : stats.metabolicScore > 60 && stats.cardiovascularScore > 60
                  ? "Good health scores with room for improvement."
                  : "Health scores need attention. Focus on lifestyle improvements."
                }
              </p>
              <button 
                onClick={() => navigate('/health-trends-3d')}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>

            {/* Improvement Opportunities */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-green-900 dark:text-green-200">Improvement Areas</h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                {stats.diabetesImprovement > 0 || stats.hypertensionImprovement > 0
                  ? "Great progress! You're improving in key health areas."
                  : "Focus on nutrition, exercise, and sleep for better health outcomes."
                }
              </p>
              <button 
                onClick={() => navigate('/tracking')}
                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                Track Progress
              </button>
            </div>

            {/* Personalized Recommendations */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                  <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-200">Personalized Tips</h4>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                {stats.diabetesRisk > 0.5 
                  ? "Focus on blood sugar management through diet and exercise."
                  : stats.hypertensionRisk > 0.5
                  ? "Prioritize heart health with cardio exercise and low-sodium diet."
                  : "Maintain balanced nutrition and regular physical activity."
                }
              </p>
              <button 
                onClick={() => navigate('/assessment')}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                Get Advice
              </button>
            </div>

            {/* Health Goals */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-200">Weekly Goals</h4>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                Set achievable weekly targets for exercise, nutrition, and sleep to improve your health scores.
              </p>
              <button 
                onClick={() => navigate('/tracking')}
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                Set Goals
              </button>
            </div>

            {/* Health Alerts */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                  <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-200">Health Alerts</h4>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                {stats.diabetesRisk > 0.75 || stats.hypertensionRisk > 0.75
                  ? "High risk alert! Consider consulting a healthcare professional."
                  : "Regular monitoring recommended. Stay consistent with health assessments."
                }
              </p>
              <button 
                onClick={() => navigate('/assessment')}
                className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg transition-colors"
              >
                Monitor Health
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/assessment')}
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">New Assessment</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get health prediction</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => navigate('/tracking')}
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Step Tracker</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatic GPS tracking</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => navigate('/health-trends-3d')}
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Health Trends</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interactive 2D line charts</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Recent Assessments */}
            <RecentAssessments limit={5} showViewAll={true} />

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gamification Components */}
            <RewardsDisplay />
            <GoalsTracker />

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommendations</h2>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-l-4 border-blue-500 dark:border-blue-400">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                        {rec.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'high' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300' 
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Health Tip of the Day</h3>
              <p className="text-sm text-blue-100 dark:text-blue-200">
                Walking for just 30 minutes after meals can significantly improve blood sugar control and reduce diabetes risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;