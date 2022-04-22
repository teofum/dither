import React, { useEffect, useState } from 'react';
import { WindowProps } from './Window.props';
import WindowViewState from './WindowState';
import ResizeMode from '../../../utils/etc/ResizeMode';

import { useAppDispatch } from '../../../hooks';
import { destroyWindow, focusWindow } from '../windowManager/windowSlice';

import icon_computer from '../../../assets/icon/computer_16.png';
import ui_close from '../../../assets/ui/close.png';
import ui_close_d from '../../../assets/ui/close.d.png';
import ui_max from '../../../assets/ui/max.png';
import ui_restore from '../../../assets/ui/restore.png';
import './Window.css';

function Window(props: WindowProps) {
  const dispatch = useAppDispatch();

  const [position, setPosition] = useState({
    x: props.left || 0,
    y: props.top || 0
  });

  const [size, setSize] = useState({
    w: Math.max(props.width || 0, props.minWidth),
    h: Math.max(props.height || 0, props.minHeight)
  });

  const [state, setState] = useState(WindowViewState.Restored);
  const [shouldStartDrag, setShouldStartDrag] = useState(false);

  useEffect(() => {
    const npos = {
      x: position.x,
      y: position.y
    };

    // On creation, move window if it overshoots screen
    if (position.x + size.w > window.innerWidth)
      npos.x = window.innerWidth - size.w;
    if (position.y + size.h > window.innerHeight)
      npos.y = window.innerHeight - size.h;

    if (npos.x < 0 || npos.y < 0) {
      setPosition({ x: 0, y: 0 });
      setState(WindowViewState.Maximized); // Window bigger than viewport, maximize
    } else setPosition(npos);
  }, []);

  useEffect(() => {
    if (shouldStartDrag) {
      dragHandler((e) => move(e));
    }

    const dragEndEvent = () => {
      setShouldStartDrag(false);
    };

    window.addEventListener('mouseup', dragEndEvent);
    return () => window.removeEventListener('mouseup', dragEndEvent);
  }, [shouldStartDrag, props.active]);

  let frame: HTMLDivElement | null = null;

  const frameStyle: React.CSSProperties = (() => {
    switch (state) {
      case WindowViewState.Restored:
        return {
          width: props.autoSize ? 'auto' : size.w,
          height: props.autoSize ? 'auto' : size.h,
          left: position.x,
          top: position.y,
          zIndex: props.zIndex
        };
      case WindowViewState.Maximized:
        return {
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          zIndex: props.zIndex
        };
    }
  })();

  //#region Window move
  // Handle moving the window on mouse drag
  const move = (ev: MouseEvent) => {
    if (ev.button !== 0) return;

    // While dragging, move the element directly via DOM
    const dragging = (ev: MouseEvent) => {
      if (!frame || !frame.parentElement) return;
      const windowRect = frame.getBoundingClientRect();
      const parentRect = frame.parentElement.getBoundingClientRect();

      frame.style.left = `${windowRect.left - parentRect.left + ev.movementX}px`;
      frame.style.top = `${windowRect.top - parentRect.top + ev.movementY}px`;
    };

    // At the end of a drag event (release)...
    const dragEnd = (ev: MouseEvent) => {
      if (ev.button !== 0) return;

      // Save the position to component state
      if (frame && frame.parentElement) {
        const windowRect = frame.getBoundingClientRect();
        const parentRect = frame.parentElement.getBoundingClientRect();

        setPosition({
          x: windowRect.left - parentRect.left,
          y: windowRect.top - parentRect.top
        });
      }

      // Clean up event listeners
      window.removeEventListener('mousemove', dragging);
      window.removeEventListener('mouseup', dragEnd);
    };

    window.addEventListener('mousemove', dragging); // Drag while moving with mouse down
    window.addEventListener('mouseup', dragEnd); // End drag on mouse up
  };
  //#endregion

  //#region Window resize
  // Handle moving the window on mouse drag
  const resize = (ev: MouseEvent, mode: ResizeMode) => {
    if (ev.button !== 0) return;

    // While dragging, move the element directly via DOM
    const dragging = (ev: MouseEvent) => {
      if (!frame || !frame.parentElement) return;
      const windowRect = frame.getBoundingClientRect();
      const parentRect = frame.parentElement.getBoundingClientRect();

      const maxHeight = props.maxHeight || Number.MAX_VALUE;
      const maxExpandY = maxHeight - windowRect.height;
      const maxContractY = windowRect.height - props.minHeight;

      const maxWidth = props.maxWidth || Number.MAX_VALUE;
      const maxExpandX = maxWidth - windowRect.width;
      const maxContractX = windowRect.width - props.minWidth;

      if (mode & ResizeMode.N) {
        const move = ev.movementY < 0 ?
          Math.max(ev.movementY, -maxExpandY) :
          Math.min(ev.movementY, maxContractY);

        frame.style.top = `${windowRect.top - parentRect.top + move}px`;
        frame.style.height = `${windowRect.height - move}px`;
      } else if (mode & ResizeMode.S) {
        const move = ev.movementY > 0 ?
          Math.min(ev.movementY, maxExpandY) :
          Math.max(ev.movementY, -maxContractY);

        frame.style.height = `${windowRect.height + move}px`;
      }

      if (mode & ResizeMode.W) {
        const move = ev.movementX < 0 ?
          Math.max(ev.movementX, -maxExpandX) :
          Math.min(ev.movementX, maxContractX);

        frame.style.left = `${windowRect.left - parentRect.left + move}px`;
        frame.style.width = `${windowRect.width - move}px`;
      } else if (mode & ResizeMode.E) {
        const move = ev.movementX > 0 ?
          Math.min(ev.movementX, maxExpandX) :
          Math.max(ev.movementX, -maxContractX);

        frame.style.width = `${windowRect.width + move}px`;
      }
    };

    // At the end of a drag event (release)...
    const dragEnd = (ev: MouseEvent) => {
      if (ev.button !== 0) return;

      // Save the position to component state
      if (frame && frame.parentElement) {
        const windowRect = frame.getBoundingClientRect();
        const parentRect = frame.parentElement.getBoundingClientRect();

        setPosition({
          x: windowRect.left - parentRect.left,
          y: windowRect.top - parentRect.top
        });

        setSize({
          w: windowRect.width,
          h: windowRect.height
        });
      }

      // Clean up event listeners
      window.removeEventListener('mousemove', dragging);
      window.removeEventListener('mouseup', dragEnd);
    };

    window.addEventListener('mousemove', dragging); // Drag while moving with mouse down
    window.addEventListener('mouseup', dragEnd); // End drag on mouse up
  };
  //#endregion

  //#region Drag handling
  // Start a drag event when conditions are right
  const dragHandler = (onstart: (ev: MouseEvent) => void, ev?: MouseEvent) => {
    if (ev && ev.button !== 0) return;

    const start = (ev: MouseEvent) => {
      onstart(ev);
      cancel();
    };

    // Clean up event listeners
    const cancel = () => {
      window.removeEventListener('mousemove', start);
      window.removeEventListener('mouseup', cancel);
    };

    // On mouse down...
    window.addEventListener('mousemove', start); // Start dragging on move
    window.addEventListener('mouseup', cancel); // Cancel on mouse up (just a click)
  };
  //#endregion

  const toggleMaximized = () => {
    if (props.maximizable === false) return;

    if (state === WindowViewState.Maximized) setState(WindowViewState.Restored);
    else setState(WindowViewState.Maximized);
  };

  const destroy = () => {
    dispatch(destroyWindow(props.id));
  };

  const focus = (target?: EventTarget) => {
    dispatch(focusWindow(props.id));

    if (!props.active && target && (target as HTMLElement).className.includes('win-title')) {
      setShouldStartDrag(true);
      console.log('drag');
    }
  };

  // resizeable defaults to true on undefined
  const canResize = !props.autoSize && props.resizeable !== false;
  const resizeHandles = [
    (<div key='nw' className='win-resize-handle-nw'
      onMouseDown={(e) => dragHandler((e) => resize(e, ResizeMode.NW), e.nativeEvent)} />),
    (<div key='n' className='win-resize-handle-n'
      onMouseDown={(e) => dragHandler((e) => resize(e, ResizeMode.N), e.nativeEvent)} />),
    (<div key='ne' className='win-resize-handle-ne'
      onMouseDown={(e) => dragHandler((e) => resize(e, ResizeMode.NE), e.nativeEvent)} />),
    (<div key='w' className='win-resize-handle-w'
      onMouseDown={(e) => dragHandler((e) => resize(e, ResizeMode.W), e.nativeEvent)} />),
    (<div key='e' className='win-resize-handle-e'
      onMouseDown={(e) => dragHandler((e) => resize(e, ResizeMode.E), e.nativeEvent)} />),
    (<div key='sw' className='win-resize-handle-sw'
      onMouseDown={(e) => dragHandler((e) => resize(e, ResizeMode.SW), e.nativeEvent)} />),
    (<div key='s' className='win-resize-handle-s'
      onMouseDown={(e) => dragHandler((e) => resize(e, ResizeMode.S), e.nativeEvent)} />),
    (<div key='se' className='win-resize-handle-se'
      onMouseDown={(e) => dragHandler((e) => resize(e, ResizeMode.SE), e.nativeEvent)} />)
  ];

  return (
    <div className={`win-frame bevel ${props.active ? 'win-active' : ''}`}
      id={`win_${props.id}`}
      style={frameStyle}
      ref={el => frame = el}
      onMouseDown={e => focus(e.target)}>

      <div className='win-main'>
        <div className='win-titlebar'
          onMouseDown={state === WindowViewState.Restored ?
            (e) => dragHandler((e) => move(e), e.nativeEvent)
            : undefined}
          onDoubleClick={toggleMaximized}>

          <img className='win-titlebar-icon' src={props.iconUrl || icon_computer} alt='icon' />
          <div className='win-titlebar-spacer' />
          <div className='win-title'>
            {props.title}
          </div>
          <div className='win-titlebar-spacer' />
          <div className='win-titlebar-button-group'>
            {props.maximizable !== false &&
              <button className='win-titlebar-button icon-button bevel' onClick={toggleMaximized}>
                <img src={state === WindowViewState.Maximized ? ui_restore : ui_max} alt='max' />
              </button>}
            <button className='win-titlebar-button icon-button bevel'
              onClick={destroy} disabled={props.closeable === false}>
              <img src={props.closeable ? ui_close_d : ui_close} alt='x' />
            </button>
          </div>
        </div>

        <div className='win-content'>
          {props.children}
        </div>
      </div>

      {canResize && state === WindowViewState.Restored && resizeHandles}
    </div>
  );
}

export default Window;