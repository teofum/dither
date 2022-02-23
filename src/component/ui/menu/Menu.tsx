import React from 'react';
import MenuProps, { isItem, isMenu, Item } from './Menu.props';
import './Menu.css';

import ui_right from '../../../assets/ui/scrollright.png';
import ui_check from '../../../assets/ui/check.c.png';

function Menu(props: MenuProps) {
  const checked = (item: Item) => {
    if (!item.checkIf || !props.data) return false;
    return props.data[item.checkIf.prop] === item.checkIf.value;
  };

  return (
    <div className='menu-root bevel'>
      {props.items.map(item => {
        if (isMenu(item)) return (
          <div key={item.id}  className='menu-item menu-submenu'>
            <span className='menu-item-label'>{item.name}</span>
            <img src={ui_right} alt='>' className='menu-item-expand' />

            <Menu items={item.items} root={item.id} data={props.data}
              onSelect={id => props.onSelect(`${item.id}/${id}`)} />
          </div>
        );
        else if (isItem(item)) return (
          <div key={item.id} className='menu-item'
            onClick={() => props.onSelect(item.id)}>
            {checked(item) &&
              <img src={ui_check} alt='check' className='menu-item-check' />}

            <span className='menu-item-label'>{item.name}</span>
          </div>
        );
        else return (<hr className='divider horizontal bevel' />);
      })}
    </div>
  );
}

export default Menu;