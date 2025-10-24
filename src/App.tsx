import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Modules } from './pages/Modules';
import { Stats } from './pages/Stats';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<JSX.Element>(<Home />);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log('Hash changed to:', hash);
      
      if (hash.startsWith('#/modules')) {
        setCurrentPage(<Modules />);
      } else if (hash.startsWith('#/stats')) {
        setCurrentPage(<Stats />);
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

  return currentPage;
};

export default App;