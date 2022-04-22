import React from 'react';

import { selectWindows } from './component/ui/windowManager/windowSlice';
import { useAppSelector, useAppDispatch } from './hooks';

import WindowManager from './component/ui/windowManager/WindowManager';
import MenuBar from './component/ui/menuBar/MenuBar';

import './App.css';

function App() {
  const { windows } = useAppSelector(selectWindows);
  const dispatch = useAppDispatch();

  return (
    <div className='app'>
      <div className='bevel' />
      <WindowManager />
    </div>
  );
}

export default App;
