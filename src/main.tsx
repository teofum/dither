import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';

import App from './App';

import { Provider } from 'react-redux';
import store from './store';

// Clamp scaling to an integer number so everything looks nice and crisp
// This works by scaling the root font-size, then everything that isn't
// resolution-independent uses rem/em for size
const clampScaling = () => {
  const scaling = window.devicePixelRatio;
  const scaleFactor = Math.round(scaling) / scaling;
  document.documentElement.style.fontSize = `${16 * scaleFactor}px`;
};

window.onresize = clampScaling;
clampScaling();

// Apply saved theme
const storedTheme = localStorage.getItem('__theme');
if (storedTheme) document.documentElement.className = storedTheme;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
