import React from 'react';
import { version } from '../../../../package.json';
import Anchor from '../../utils/Anchor';

import './About.css';

function About() {
  return (
    <div className='about-root bevel content'>
      <div>
        <h1 className='about-title'>D<span>i</span>therOS</h1>
        <div>DitherOS v{version}</div>
        <div>Created by <Anchor href='https://fumagalli.ar'>Teo Fumagalli</Anchor></div>
        <div>Source code on <Anchor href='https://github.com/teofum/dither'>GitHub</Anchor></div>
      </div>

      <span>This software is available under the MIT License. (C)2022 Teo Fumagalli.</span>
    </div>
  );
}

export default About;