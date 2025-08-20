/**
 * ErrorBoundary component
 * - Purpose: Catch unexpected runtime errors in React tree and render a friendly fallback UI.
 * - Provides quick actions: reload page or go home.
 */

import React from 'react';

/**
 * Props for ErrorBoundary
 */
interface ErrorBoundaryProps {
  /** Children to render within the error boundary */
  children: React.ReactNode;
  /** Optional custom fallback node (if provided, it will be rendered when error occurs) */
  fallback?: React.ReactNode;
}

/**
 * State for ErrorBoundary
 */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;
  /** Optional error message for display/logging */
  message?: string;
}

/**
 * ErrorBoundary class component
 * - Catches errors in descendant components and prevents full app crash
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /** Initialize state */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: undefined };
  }

  /**
   * Lifecycle: update state when an error is thrown
   */
  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    let message: string;
    if (error && typeof error === 'object' && 'message' in error) {
      message = String((error as any).message);
    } else {
      message = 'Something went wrong.';
    }
    return { hasError: true, message };
  }

  /**
   * Lifecycle: side-effect logging (optional)
   */
  componentDidCatch(error: unknown, errorInfo: unknown) {
    // eslint-disable-next-line no-console
    console.error('Caught by ErrorBoundary:', error, errorInfo);
  }

  /**
   * Reset the boundary by reloading the page (ensures a clean state)
   */
  private handleReload = () => {
    window.location.reload();
  };

  /**
   * Navigate back to home via hash router (no dependency on Link)
   */
  private handleGoHome = () => {
    window.location.hash = '#/';
  };

  /**
   * Render fallback UI when an error occurs or render children otherwise
   */
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl shadow-lg p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-500 text-2xl" aria-hidden>!</span>
            </div>
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-600 mb-6">
              {this.state.message || 'An unexpected error occurred. You can try reloading the page or return home.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800"
              >
                Reload page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2 rounded-md border bg-transparent border-gray-300 text-gray-800 hover:border-cyan-400 hover:text-cyan-400"
              >
                Go to Home
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-6">If the issue persists, please contact support.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
