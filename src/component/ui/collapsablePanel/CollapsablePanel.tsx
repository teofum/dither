import React, { useState } from 'react';
import CollapsablePanelProps from './CollapsablePanel.props';

import ui_down from '../../../assets/ui/scrolldown.png';
import ui_up from '../../../assets/ui/scrollup.png';
import './CollapsablePanel.css';

function CollapsablePanel(props: CollapsablePanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className='coll-root bevel'>
      <div className='coll-titlebar' onClick={() => setExpanded(!expanded)}>
        <span className='coll-title'>{props.title}</span>
        <div className='coll-titlebar-spacer' />
        <img src={expanded ? ui_up : ui_down} />
      </div>

      <div className='coll-content' style={!expanded ? {display: 'none'} : undefined}>
        {props.children}
      </div>
    </div>
  );
}

export default CollapsablePanel;