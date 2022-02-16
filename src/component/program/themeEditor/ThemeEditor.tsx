import React, { useState } from 'react';

import icon_computer from '../../../assets/icon/computer_16.png';
import ui_close from '../../../assets/ui/close.png';
import ui_max from '../../../assets/ui/max.png';
import classlist from '../../../utils/etc/classlist';
import ComboBox from '../../ui/comboBox/ComboBox';
import '../../ui/window/Window.css';
import './ThemeEditor.css';

const colorThemes = [
  { className: 'theme__default', displayName: 'Default' },
  { className: 'theme__dark', displayName: 'Dark' },
  { className: 'theme__2k', displayName: '2K' },
  { className: 'theme__blue', displayName: 'Steel' }
];

const fontSets = [
  { className: 'set0', displayName: 'Default Font Set' },
  { className: 'set1', displayName: 'Font Set 1' },
  { className: 'set2', displayName: 'Font Set 2' },
  { className: 'set3', displayName: 'Font Set 3' }
];

const titleFonts = [
  { className: 'siemens', displayName: 'Siemens PC-D' },
  { className: 'apricot', displayName: 'Apricot Xen C' },
  { className: 'ti', displayName: 'TI Pro' },
  { className: 'jpn12', displayName: 'DOS/V JPN12' },
  { className: 'ank16', displayName: 'DOS/V ANK16' },
  { className: 'stingray', displayName: 'CL Stingray 8x16' }
];


function ThemeEditor() {
  const currentTheme = document.documentElement.className.split(' ');

  const currentColorTheme = currentTheme
    .find(cl => cl.startsWith('theme__'));

  const currentBaseFont = currentTheme
    .find(cl => cl.startsWith('font-base__'))
    ?.split('__')[1];

  const currentTextFont = currentTheme
    .find(cl => cl.startsWith('font-text__'))
    ?.split('__')[1];

  const currentTitleFont = currentTheme
    .find(cl => cl.startsWith('font-title__'))
    ?.split('__')[1];
  
  const [colorTheme, setColorTheme] = useState(currentColorTheme || '');
  const [baseFont, setBaseFont] = useState(currentBaseFont || '');
  const [textFont, setTextFont] = useState(currentTextFont || '');
  const [titleFont, setTitleFont] = useState(currentTitleFont || '');

  const theme = classlist(
    colorTheme,
    `font-base__${baseFont}`,
    `font-text__${textFont}`,
    `font-title__${titleFont}`
  );
  console.log(theme);

  const apply = () => {
    document.documentElement.className = theme;
    localStorage.setItem('__theme', theme);
  };

  return (
    <div className='theme-root content'>
      <div className='theme-preview bevel content'>
        <div className={classlist('theme-preview-bg', theme)}>
          <div className='theme-fake-frame bevel'>
            <div className='win-main'>
              <div className='win-titlebar'>
                <img className='win-titlebar-icon' src={icon_computer} alt='icon' />
                <div className='win-titlebar-spacer' />
                <div className='win-title'>
                  Window Title
                </div>
                <div className='win-titlebar-spacer' />
                <div className='win-titlebar-button-group'>
                  <div className='win-titlebar-button fake-button icon-button bevel'>
                    <img src={ui_max} alt='max' />
                  </div>
                  <div className='win-titlebar-button fake-button icon-button bevel'>
                    <img src={ui_close} alt='x' />
                  </div>
                </div>
              </div>

              <div className='win-content theme-fake-content bevel'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>

              <div className='action-bar'>
                <div className='fake-button bevel'>Cancel</div>
                <div className='fake-button bevel'>OK</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='theme-settings'>
        <span className='theme-label'>Color Theme</span>
        <ComboBox
          value={colorTheme}
          options={colorThemes.map(theme => ({
            name: theme.displayName,
            value: theme.className
          }))}
          onChange={(e) => setColorTheme(e.selected.value)} />

        {/* <span className='theme-label'>UI Font</span>
        <ComboBox
          value={baseFont}
          options={fonts.map(font => ({
            name: font.displayName,
            value: font.className
          }))}
          onChange={(e) => setBaseFont(e.selected.value)} /> */}

        <span className='theme-label'>Text Font</span>
        <ComboBox
          value={textFont}
          options={fontSets.map(font => ({
            name: font.displayName,
            value: font.className
          }))}
          onChange={(e) => setTextFont(e.selected.value)} />

        <span className='theme-label'>Title Font</span>
        <ComboBox
          value={titleFont}
          options={titleFonts.map(font => ({
            name: font.displayName,
            value: font.className
          }))}
          onChange={(e) => setTitleFont(e.selected.value)} />
      </div>

      <div className='theme-actions action-bar'>
        <button className='bevel' onClick={apply}>Apply</button>
      </div>
    </div>
  );
};

export default ThemeEditor;