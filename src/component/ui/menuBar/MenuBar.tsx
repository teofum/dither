import React, { useEffect, useState } from 'react';
import classlist from '../../../utils/etc/classlist';
import Menu from '../menu/Menu';
import MenuBarProps from './MenuBar.props';
import './MenuBar.css';

function MenuBar(props: MenuBarProps) {
  let menuRef: HTMLDivElement | null = null;
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!menuRef) return;
    const onClickOutside = (ev: Event) => {
      if (menuRef && !menuRef.contains(ev.target as Element)) {
        setActive(null);
        window.removeEventListener('mousedown', onClickOutside);
      }
    };

    window.addEventListener('mousedown', onClickOutside);
  }, [active]);

  const select = (id: string) => {
    props.onSelect(id);
  };

  const toggleActive = (id: string) => {
    setActive(active === id ? null : id);
  };

  const switchActive = (id: string) => {
    if (active) setActive(id);
  };

  return (
    <div className='mbar-root'
      ref={el => menuRef = el}>
      {props.menus.map(menu => (
        <div key={menu.id}
          className={classlist(
            'mbar-item',
            active === menu.id ? 'mbar-active' : ''
          )}
          onClick={() => toggleActive(menu.id)}
          onMouseEnter={() => switchActive(menu.id)}>

          <span className='mbar-item-label'>{menu.name}</span>

          {active === menu.id &&
            <Menu items={menu.items} root={menu.id} data={props.data}
              onSelect={id => select(`${menu.id}/${id}`)} />}
        </div>
      ))}
    </div>
  );
}

export default MenuBar;