import React from 'react';
import launcherWindow from '../../program/launcher/Launcher.window';
import Window from '../window/Window';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { createWindow, selectWindows } from './windowSlice';

function WindowManager() {
  const { windows } = useAppSelector(selectWindows);
  const dispatch = useAppDispatch();

  return (
    <div className='desktop'>
      <button className='bevel'
        onClick={() => dispatch(createWindow(launcherWindow))}>
        Program Manager
      </button>

      {windows.map(window => (
        <Window key={window.id} {...window}>
          {window.children}
        </Window>
      ))}
    </div>
  );
}

export default WindowManager;