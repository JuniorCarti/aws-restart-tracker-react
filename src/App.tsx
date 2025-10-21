import React from 'react';
import { Home } from './pages/Home';
import { Modules } from './pages/Modules';
import { Stats } from './pages/Stats';

const App: React.FC = () => {
  const getCurrentPage = () => {
    const hash = window.location.hash;
    switch (hash) {
      case '#/modules':
        return <Modules />;
      case '#/stats':
        return <Stats />;
      default:
        return <Home />;
    }
  };

  return getCurrentPage();
};

export default App;