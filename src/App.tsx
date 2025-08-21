import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import LearnMore from './pages/LearnMore';
import Login from './pages/Login';
import Enroll from './pages/Enroll';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import ProgramDetail from './pages/ProgramDetail';
import MemberContent from './pages/ClinicalPrograms';
import Account from './pages/Account';
import Bookmarks from './pages/Bookmarks';
import { useAuthStore } from './stores/authStore';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Toaster } from 'sonner';
import ScrollToTop from './components/common/ScrollToTop';
import BackToTop from './components/common/BackToTop';
import { AuthProvider } from './components/auth/AuthContext';

/**
 * Protected route component for member-only pages
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
}

/**
 * App root component
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          {/* Public Routes - NO AuthProvider */}
          <Route path="/" element={<Home />} />
          <Route path="/learnmore" element={<LearnMore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/enroll" element={<Enroll />} />

          {/* Protected Routes - WITH AuthProvider */}
          <Route
            path="/dashboard"
            element={
              <AuthProvider>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </AuthProvider>
            }
          />
          <Route
            path="/member-content"
            element={
              <AuthProvider>
                <ProtectedRoute>
                  <MemberContent />
                </ProtectedRoute>
              </AuthProvider>
            }
          />
          <Route
            path="/resources"
            element={
              <AuthProvider>
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              </AuthProvider>
            }
          />
          <Route
            path="/program/:programSlug"
            element={
              <AuthProvider>
                <ProtectedRoute>
                  <ProgramDetail />
                </ProtectedRoute>
              </AuthProvider>
            }
          />
          <Route
            path="/account"
            element={
              <AuthProvider>
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              </AuthProvider>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <AuthProvider>
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              </AuthProvider>
            }
          />
        </Routes>
        <Toaster />
        <BackToTop />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
