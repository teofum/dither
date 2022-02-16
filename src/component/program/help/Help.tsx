import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import classlist from '../../../utils/etc/classlist';

import helpPages, { flattenPages, HelpItem } from './assets/helpPages';

import ui_plus from '../../../assets/ui/plus.png';
import ui_minus from '../../../assets/ui/minus.png';
import './Help.css';

// Flattened help pages used for navigation
const flat = flattenPages(helpPages);

function Help() {
  const [expanded, setExpanded] = useState(['/help']);
  const [selected, setSelected] = useState(helpPages);

  const toggleExpanded = (fullId: string) => {
    if (expanded.includes(fullId))
      setExpanded(expanded.filter(id => id !== fullId));
    else setExpanded(expanded.concat(fullId));
  };

  const goToPage = (fullPath: string) => {
    const parts = fullPath.split('/').slice(1);
    let item = helpPages;
    let id = 'help';
    for (const part of parts) {
      id = `${id}/${part}`;
      const child = item.children?.find(c => c.id === id);
      if (child) item = child;
      else return;
    }

    const parentId = id.split('/').slice(0, -1).join('/');
    if (!expanded.includes(parentId)) toggleExpanded(parentId);
    setSelected(item);
  };

  const getPreviousId = () => {
    const index = flat.findIndex(i => i.id === selected.id);
    if (index < 1) return;

    return flat[index - 1].id;
  };

  const getNextId = () => {
    const index = flat.findIndex(i => i.id === selected.id);
    if (index === -1 || index >= flat.length - 1) return;

    return flat[index + 1].id;
  };

  const renderHelpItem = (item: HelpItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded.includes(item.id);
    const isSelected = selected === item;

    return (
      <li id={item.id}
        className={classlist('help-nav-item', isSelected ? 'selected' : '')}>

        {hasChildren &&
          <button className='help-nav-item-button'
            onClick={() => toggleExpanded(item.id)}>
            <img src={isExpanded ? ui_minus : ui_plus} alt={isExpanded ? '-' : '+'} />
          </button>}

        <span className='help-nav-item-label'
          onClick={() => setSelected(item)}>
          {item.name}
        </span>

        {isExpanded && hasChildren &&
          <ul className='help-nav-item-children'>
            {item.children?.map(child =>
              renderHelpItem(child))}
          </ul>}
      </li>
    );
  };

  return (
    <div className='help-root'>
      <div className='help-nav bevel content'>
        <ul className='help-nav-tree'>
          {renderHelpItem(helpPages)}
        </ul>
      </div>

      <div className='help-infobar'>
        <button className='bevel'
          disabled={getPreviousId() === undefined}
          onClick={() => goToPage(getPreviousId() || '')}>
          ↑
        </button>
        <button className='bevel'
          disabled={getNextId() === undefined}
          onClick={() => goToPage(getNextId() || '')}>
          ↓
        </button>
        <span>{selected.name}</span>
      </div>

      <div className='help-content bevel content'>
        <div className="help-content-scroll">
          <ReactMarkdown components={{
            a({ href, children, ...props }) {
              if (href?.startsWith('help')) return (
                <a className='fake-href' {...props}
                  onClick={() => goToPage(href)}>
                  {children}
                </a>
              );
              else return (
                <a href={href} {...props}
                  target='_blank' rel='noopener noreferrer'>
                  {children}
                </a>
              );
            }
          }}>
            {selected.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default Help;