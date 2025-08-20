

import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import LearnMore from './pages/learnmore';
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

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

function Page() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    function getTodos() {
      const { data: todos } = await supabase.from('todos').select()

      if (todos.length > 1) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])

  return (
    <div>
      {todos.map((todo) => (
        <li key={todo}>{todo}</li>
      ))}
    </div>
  )
}
export default Page

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
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/learnmore" element={<LearnMore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enroll" element={<Enroll />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member-content"
              element={
                <ProtectedRoute>
                  <MemberContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/program/:programSlug"
              element={
                <ProtectedRoute>
                  <ProgramDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
      {/* Global toaster for compact notifications across the app */}
      <Toaster position="top-center" richColors={false} closeButton={false} duration={1800} />
      {/* Global back-to-top button */}
      <BackToTop />
    </BrowserRouter>
  );
}
