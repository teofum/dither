import React, { useEffect, useState } from 'react';
import launcherWindow from '../../program/launcher/Launcher.window';
import Window from '../window/Window';
import WindowProps, { WindowTemplate } from '../window/Window.props';

let nwLocation = {x: 100, y: 100};

function WindowManager() {
  const [newId, setNewId] = useState(0);
  const [windows, setWindows] = useState<WindowProps[]>([]);
  const [newWindow, setNewWindow] = useState<WindowTemplate>();

  useEffect(() => {
    if (newWindow) {
      create(newWindow);
      setNewWindow(undefined);
    }
  }, [newWindow]);

  const create = (template: WindowTemplate) => {
    const newWindow = {
      id: newId,
      ...template,
      top: template.top || nwLocation.y,
      left: template.left || nwLocation.x
    };

    setWindows(windows.concat(newWindow));
    setNewId(newId + 1);

    nwLocation = { x: 100 + (nwLocation.x - 50) % 500, y: 100 + (nwLocation.y - 50) % 300 };
  };

  const destroy = (wid: number) => {
    setWindows(windows.filter(win => win.id !== wid));
  };

  const launch = (template: WindowTemplate) => {
    setNewWindow(template);
  };

  return (
    <div className='desktop'>
      <button className='bevel' onClick={() => create(launcherWindow({onLaunch: launch}))}>
        Program Manager
      </button>

      {windows.map(window => (
        <Window key={window.id} {...window} onClose={destroy}>
          {window.children}
        </Window>
      ))}
    </div>
  );
}

export default WindowManager;