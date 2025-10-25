import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Modules } from './pages/Modules';
import { Stats } from './pages/Stats';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Main app content with routing
const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<JSX.Element>(<Home />);
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log('Hash changed to:', hash);
      
      if (hash.startsWith('#/modules')) {
        setCurrentPage(
          <ProtectedRoute>
            <Modules />
          </ProtectedRoute>
        );
      } else if (hash.startsWith('#/stats')) {
        setCurrentPage(
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        );
      } else if (hash.startsWith('#/login')) {
        setCurrentPage(<Login />);
      } else if (hash.startsWith('#/signup')) {
        setCurrentPage(<Signup />);
      } else {
        setCurrentPage(<Home />);
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial page
    handleHashChange();

    // Cleanup
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return currentPage;
};

// Main App component with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;