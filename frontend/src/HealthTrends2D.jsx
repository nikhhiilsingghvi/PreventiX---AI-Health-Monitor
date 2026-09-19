import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Activity, Heart, BarChart3, Droplet, Calendar, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { recentAssessments } from './api';

const HealthTrends2D = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const data = await recentAssessments.getRecent(50); // Get more data for trends
        setAssessments(data);
      } catch (error) {
        console.error('Failed to fetch assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Process data for charts
  const processChartData = () => {
    if (!assessments || assessments.length === 0) return [];

    // Sort by date and limit by time range
    const sortedAssessments = assessments
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-parseInt(timeRange));

    return sortedAssessments.map((assessment, index) => ({
      date: new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: assessment.date,
      diabetesRisk: assessment.diabetes_risk || 0,
      hypertensionRisk: assessment.hypertension_risk || 0,
      metabolicScore: assessment.metabolic_health_score || 0,
      cardiovascularScore: assessment.cardiovascular_health_score || 0,
      overallScore: assessment.overall_score || 0,
      index: index + 1
    }));
  };

  const chartData = processChartData();

  const metrics = [
    {
      id: 'all',
      name: 'All Metrics',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'diabetes',
      name: 'Diabetes Risk',
      icon: <Droplet className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      dataKey: 'diabetesRisk'
    },
    {
      id: 'hypertension',
      name: 'Hypertension Risk',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-red-500 to-red-600',
      dataKey: 'hypertensionRisk'
    },
    {
      id: 'metabolic',
      name: 'Metabolic Health',
      icon: <Activity className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      dataKey: 'metabolicScore'
    },
    {
      id: 'cardiovascular',
      name: 'Cardiovascular Health',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      dataKey: 'cardiovascularScore'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (selectedMetric === 'all') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="diabetesRisk" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Diabetes Risk"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="hypertensionRisk" 
              stroke="#ef4444" 
              strokeWidth={3}
              name="Hypertension Risk"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="metabolicScore" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Metabolic Health"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="cardiovascularScore" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              name="Cardiovascular Health"
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      const metric = metrics.find(m => m.id === selectedMetric);
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={metric.dataKey}
              stroke={metric.color.includes('green') ? '#10b981' : 
                     metric.color.includes('red') ? '#ef4444' :
                     metric.color.includes('blue') ? '#3b82f6' : '#8b5cf6'}
              fill={metric.color.includes('green') ? '#10b981' : 
                    metric.color.includes('red') ? '#ef4444' :
                    metric.color.includes('blue') ? '#3b82f6' : '#8b5cf6'}
              fillOpacity={0.3}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading health trends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Health Trends</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track your health progress over time</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Metric to View</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMetric === metric.id
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedMetric === metric.id
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {metric.icon}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-medium ${
                      selectedMetric === metric.id
                        ? 'text-blue-900 dark:text-blue-200'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {metric.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedMetric === 'all' ? 'All Health Metrics' : metrics.find(m => m.id === selectedMetric)?.name} Trends
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{chartData.length} assessments</span>
            </div>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-96">
              {renderChart()}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Data Available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Complete some health assessments to see your trends
                </p>
                <button
                  onClick={() => navigate('/assessment')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Take Assessment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Droplet className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Diabetes Risk</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chartData[chartData.length - 1]?.diabetesRisk?.toFixed(1) || 0}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Latest assessment
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hypertension Risk</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chartData[chartData.length - 1]?.hypertensionRisk?.toFixed(1) || 0}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Latest assessment
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Metabolic Health</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chartData[chartData.length - 1]?.metabolicScore?.toFixed(1) || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Health score
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cardiovascular</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chartData[chartData.length - 1]?.cardiovascularScore?.toFixed(1) || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Health score
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTrends2D;

