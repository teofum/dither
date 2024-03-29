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

const backgrounds = [
  { className: 'bg__none', displayName: 'None' },
  { className: 'bg__grid', displayName: 'Grid' },
  { className: 'bg__dots', displayName: 'Dots' },
  { className: 'bg__bliss', displayName: 'Bliss' }
];

const backgroundModes = [
  { className: 'bgm__tile', displayName: 'Tile' },
  { className: 'bgm__center', displayName: 'Center' },
  { className: 'bgm__fill', displayName: 'Fill' }
];

const fontSets = [
  { className: 'set0', displayName: 'Default Font Set' },
  { className: 'set1', displayName: 'Font Set 1' },
  { className: 'set2', displayName: 'Font Set 2' },
  { className: 'set3', displayName: 'Font Set 3' }
];

const titleFonts = [
  { className: 'paradise', displayName: 'Paradise132 7x16' },
  { className: 'jpn12', displayName: 'DOS/V JPN12' },
  { className: 'ank16', displayName: 'DOS/V ANK16' },
  { className: 'tosh2', displayName: 'ToshibaTxL2 8x16' }
];


function ThemeEditor() {
  const currentTheme = document.documentElement.className.split(' ');

  const currentColorTheme = currentTheme
    .find(cl => cl.startsWith('theme__'));

  const currentBackground = currentTheme
    .find(cl => cl.startsWith('bg__'));

  const currentBackgroundMode = currentTheme
    .find(cl => cl.startsWith('bgm__'));

  const currentTextFont = currentTheme
    .find(cl => cl.startsWith('font-text__'))
    ?.split('__')[1];

  const currentTitleFont = currentTheme
    .find(cl => cl.startsWith('font-title__'))
    ?.split('__')[1];

  const [colorTheme, setColorTheme] = useState(
    colorThemes.find(ct => ct.className === currentColorTheme)?.className || '');
  const [background, setBackground] = useState(
    backgrounds.find(bg => bg.className === currentBackground)?.className || '');
  const [backgroundMode, setBackgroundMode] = useState(
    backgroundModes.find(bgm => bgm.className === currentBackgroundMode)?.className || '');
  const [fontSet, setFontSet] = useState(
    fontSets.find(fs => fs.className === currentTextFont)?.className || '');
  const [titleFont, setTitleFont] = useState(
    titleFonts.find(tf => tf.className === currentTitleFont)?.className || '');

  const theme = classlist(
    colorTheme,
    background,
    backgroundMode,
    `font-text__${fontSet}`,
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
                <h1>Heading</h1>
                <h2>Heading 2</h2>
                <h3>Heading 3</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
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

        <span className='theme-label'>Desktop Background</span>
        <div className="theme-setting-split">
          <ComboBox
            value={background}
            options={backgrounds.map(theme => ({
              name: theme.displayName,
              value: theme.className
            }))}
            onChange={(e) => setBackground(e.selected.value)} />

          <ComboBox
            value={backgroundMode}
            options={backgroundModes.map(theme => ({
              name: theme.displayName,
              value: theme.className
            }))}
            disabled={background === 'bg__none'}
            onChange={(e) => setBackgroundMode(e.selected.value)} />
        </div>

        <span className='theme-label'>Text Font</span>
        <ComboBox
          value={fontSet}
          options={fontSets.map(font => ({
            name: font.displayName,
            value: font.className
          }))}
          onChange={(e) => setFontSet(e.selected.value)} />

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