import React from 'react';
import launcherWindow from '../window/templates/Launcher.window';
import Window from '../window/Window';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { createWindow, selectWindows } from './windowSlice';
import Launcher from '../../program/launcher/Launcher';
import Help from '../../program/help/Help';
import ThemeEditor from '../../program/themeEditor/ThemeEditor';
import DitherLab from '../../program/ditherLab/DitherLab';
import WindowContent from '../window/WindowContent';

function WindowManager() {
  const { windows } = useAppSelector(selectWindows);
  const dispatch = useAppDispatch();

  const getComponent = (program: WindowContent) => {
    switch (program) {
      case WindowContent.Launcher:
        return (<Launcher />);
      case WindowContent.Help:
        return (<Help />);
      case WindowContent.ThemeEditor:
        return (<ThemeEditor />);
      case WindowContent.DitherLab:
        return (<DitherLab />);
    }
  };

  return (
    <div className='desktop'>
      <button className='bevel'
        onClick={() => dispatch(createWindow(launcherWindow))}>
        Program Manager
      </button>

      {windows.map(window => (
        <Window key={window.id} {...window}>
          {window.content && getComponent(window.content)}
        </Window>
      ))}
    </div>
  );
}

export default WindowManager;