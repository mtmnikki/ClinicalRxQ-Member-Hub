/**
 * Main header component with navigation
 * - Public menu stays the same for all users
 * - If authenticated, show a prominent DASHBOARD button beside the user info (remove it from the main nav)
 * - Right-side auth area (member name + Logout) remains dynamic
 * - Update: Improve DASHBOARD button gradient contrast by removing light teal.
 */
import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { Button } from '../ui/button';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import SafeText from '../common/SafeText';

/**
 * Header component
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  /** Base public nav items (same for public and members) */
  const publicNavItems = useMemo(
    () => [
      { href: '/', label: 'Home' },
      { href: '/learnmore', label: 'LearnMore' },
    ],
    []
  );

  /**
   * Compute nav items:
   * - Always use public items only (do NOT inject dashboard into this list)
   * - The dashboard entry is now a separate button next to the user info area
   */
  const navItems = publicNavItems;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-cyan-400 to-teal-300 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <img
                  src="https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/0fb3f1b8-e6cd-4575-806d-018bad3c9e1a.png"
                  alt="ClinicalRxQ Logo"
                  className="w-6 h-6"
                />
              </div>
            </div>
            <div className="text-2xl font-bold">
              <span className="text-gray-800">Clinical</span>
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">RxQ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  location.pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User summary */}
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    <SafeText value={user?.name} />
                  </span>
                </div>

                {/* DASHBOARD button (gradient, prominent) - updated gradient for contrast */}
                <Link to="/dashboard">
                  <Button
                    size="sm"
                    className="uppercase tracking-wide bg-gradient-to-r from-blue-800 via-cyan-700 to-cyan-600 hover:from-blue-900 hover:via-cyan-800 hover:to-cyan-700 text-white"
                  >
                    DASHBOARD
                  </Button>
                </Link>

                {/* Logout */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="bg-transparent flex items-center space-x-2 border-gray-300 hover:border-cyan-400 hover:text-cyan-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gray-300 hover:border-cyan-400 hover:text-cyan-400"
                  >
                    Member Login
                  </Button>
                </Link>
                <Link to="/enroll">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-400 text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-cyan-400 ${
                    location.pathname === item.href ? 'text-cyan-400' : 'text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  {/* User summary */}
                  <div className="flex items-center px-3 py-2">
                    <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      <SafeText value={user?.name} />
                    </span>
                  </div>

                  {/* Mobile DASHBOARD button (full width) - updated gradient */}
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-800 via-cyan-700 to-cyan-600 hover:from-blue-900 hover:via-cyan-800 hover:to-cyan-700 text-white uppercase tracking-wide">
                      DASHBOARD
                    </Button>
                  </Link>

                  {/* Logout */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="bg-transparent w-full flex items-center justify-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="bg-transparent w-full">
                      Member Login
                    </Button>
                  </Link>
                  <Link to="/enroll" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 hover:from-blue-700 hover:via-cyan-600 hover:to-teal-400 text-white"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
