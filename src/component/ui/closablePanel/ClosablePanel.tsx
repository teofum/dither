import React from 'react';
import ClosablePanelProps from './ClosablePanel.props';

import ui_close from '../../../assets/ui/close.png';
import './ClosablePanel.css';

function ClosablePanel(props: ClosablePanelProps) {
  return (
    <div className='clos-root bevel'>
      <div className='clos-titlebar'>
        <span className='clos-title'>{props.title}</span>
        <div className='clos-titlebar-spacer' />
        <button className='clos-close icon-button bevel light hover'
          onClick={props.onClosed}>
          <img src={ui_close} alt='x' />
        </button>
      </div>

      <div className='clos-content'>
        {props.children}
      </div>
    </div>
  );
}

export default ClosablePanel;