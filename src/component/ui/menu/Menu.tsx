import React from 'react';
import MenuProps, { isMenu } from './Menu.props';
import './Menu.css';

import ui_right from '../../../assets/ui/scrollright.png';

function Menu(props: MenuProps) {
  return (
    <div className='menu-root bevel'>
      {props.items.map(item => {
        if (isMenu(item)) return (
          <div key={item.id}  className='menu-item menu-submenu'>
            <span className='menu-item-label'>{item.name}</span>
            <img src={ui_right} alt='>' />

            <Menu items={item.items} root={item.id}
              onSelect={id => props.onSelect(`${item.id}/${id}`)} />
          </div>
        );
        else return (
          <div key={item.id} className='menu-item'
            onClick={() => props.onSelect(item.id)}>
            <span className='menu-item-label'>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Menu;