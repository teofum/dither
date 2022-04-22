import React from 'react';

import WindowManager from './component/ui/windowManager/WindowManager';

import './App.css';
import ApplicationBar from './component/ui/applicationBar/ApplicationBar';

function App() {
  return (
    <div className='app'>
      <ApplicationBar />
      <WindowManager />
    </div>
  );
}

export default App;
