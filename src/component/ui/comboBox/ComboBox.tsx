import React, { useEffect } from 'react';
import ComboBoxProps, { ComboBoxOption } from './ComboBox.props';

import ui_down from '../../../assets/ui/scrolldown.png';
import ui_down_d from '../../../assets/ui/scrolldown.d.png';
import './ComboBox.css';

function ComboBox<T>(props: ComboBoxProps<T>) {
  let container: HTMLDivElement | null = null;
  let list: HTMLDivElement | null = null;

  useEffect(() => {
    if (!props.options.find(op => op.value === props.value))
      change(props.options[0]);
  }, [props.options]);

  const change = (option?: ComboBoxOption<T>) => {
    if (!option) return;
    if (list) list.classList.remove('show');

    if (props.onChange)
      props.onChange({
        selected: option
      });
  };

  const toggleList = () => {
    if (!container || !list) return;

    if (!list.classList.contains('show')) {
      const containerRect = container.getBoundingClientRect();
      list.style.top = `${containerRect.bottom}px`;
      list.style.left = `${containerRect.left}px`;
      list.style.width = `${containerRect.width}px`;
      list.classList.add('show');

      const onClickAnywhere = (ev: Event) => {
        const target = (ev as MouseEvent).target as Element;
        if (!container?.contains(target)) {
          if (list) list.classList.remove('show');
          window.removeEventListener('mousedown', onClickAnywhere);
        }
      };

      window.addEventListener('mousedown', onClickAnywhere);
    } else list.classList.remove('show');
  };

  return (
    <div className='cmb-root bevel inset' ref={el => container = el}>
      <input type='text' className='cmb-input' readOnly disabled={props.disabled}
        value={props.options.find(op => op.value === props.value)?.name || ''} />
      <button className='cmb-button bevel' onClick={toggleList}>
        <img src={props.disabled ? ui_down_d : ui_down} alt='v' />
      </button>

      <div className='cmb-option-list' ref={el => list = el}>
        {props.options.map((option, i) => (
          <div key={i} className='cmb-option' onClick={() => change(option)}>
            {option.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComboBox;