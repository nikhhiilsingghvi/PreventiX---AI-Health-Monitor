import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './AuthContext';
import { SettingsProvider } from './SettingsContext';
import { GamificationProvider } from './GamificationContext';
import NotificationManager from './NotificationManager';
import SettingsApplier from './SettingsApplier';
import HealthTips from './HealthTips';
import { ThemeProvider } from './ThemeContext';

// Lazy-loaded route components — loaded only when the route is visited
const LoginPage = lazy(() => import('./LoginPage'));
const Dashboard = lazy(() => import('./Dashboard'));
const HealthAssessment = lazy(() => import('./HealthAssessment'));
const AssessmentHistory = lazy(() => import('./AssessmentHistory'));
const StepTracker = lazy(() => import('./StepTracker'));
const HealthTrends2D = lazy(() => import('./HealthTrends2D'));

// Full-screen loading spinner shown while a lazy chunk loads
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <SettingsProvider>
          <SettingsApplier />
          <AuthProvider>
            <GamificationProvider>
              <NotificationManager />
              <HealthTips />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <HealthAssessment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute>
                  <StepTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment-history"
              element={
                <ProtectedRoute>
                  <AssessmentHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/health-trends"
              element={
                <ProtectedRoute>
                  <HealthTrends2D />
                </ProtectedRoute>
              }
            />
            {/* Legacy route redirect */}
            <Route path="/health-trends-3d" element={<Navigate to="/health-trends" replace />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
            </GamificationProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;