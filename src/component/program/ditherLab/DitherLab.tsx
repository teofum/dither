import React, { useEffect, useReducer } from 'react';
import CollapsablePanel from '../../ui/collapsablePanel/CollapsablePanel';
import DitherLabImageOptions from './options/DitherLabImageOptions';
import DitherLabResizeOptions from './options/DitherLabResizeOptions';
import DitherLabPaletteOptions from './options/DitherLabPaletteOptions';
import DitherLabProcessOptions from './options/DitherLabProcessOptions';

import { dlabInitialState, DlabRenderStatus, DlabResizeMode } from './DitherLab.state';
import dlabState from './DitherLab.reducer';
import dlabActions from './DitherLab.action';

import icon_save from '../../../assets/icon/save.png';
import './DitherLab.css';
import { DitherLabDevice } from './utils/DitherLabProgram';
import DitherLabEditorPane from './options/DitherLabEditorPane';
import ClosablePanel from '../../ui/closablePanel/ClosablePanel';
import MenuBar from '../../ui/menuBar/MenuBar';
import dlabMenus from './DitherLab.menu';
import ProgramProps from '../ProgramProps';
import { useAppDispatch } from '../../../hooks';
import { createWindow, destroyWindow } from '../../ui/windowManager/windowSlice';
import { createHelpWindow } from '../../ui/window/templates/Help.window';

function DitherLab(props: ProgramProps) {
  let imageArea: HTMLDivElement | null = null;
  let toolPane: HTMLDivElement | null = null;

  const [state, dispatch] = useReducer(dlabState.reducer, dlabInitialState);
  const globalDispatch = useAppDispatch();

  useEffect(() => {
    const savedData = localStorage.getItem('__dlab_custom_palettes');

    if (savedData) {
      const saved = JSON.parse(savedData);

      if (saved.length > 0 && saved[0].data)
        dispatch(dlabActions.setCustomPalettes(saved));
    }
  }, []);

  useEffect(() => {
    const custom = state.options.palette.customPalettes;

    localStorage.setItem('__dlab_custom_palettes', JSON.stringify(custom));
  }, [state.options.palette.customPalettes]);

  useEffect(() => {
    const ia = imageArea;
    const rt = ia?.querySelector('canvas');
    if (!ia || !rt) return;

    rt.style.width = `${state.view.scale * rt.width / 16}rem`;

    const iaHasScroll = (
      ia.scrollWidth > ia.clientWidth ||
      ia.scrollHeight > ia.clientHeight);

    if (iaHasScroll) ia.classList.add('__scroll');
    else ia.classList.remove('__scroll');
  }, [state.view.scale]);

  useEffect(() => {
    // Destroy render target on device change
    dispatch(dlabActions.setRenderTarget(null));
  }, [state.options.process.device]);

  useEffect(() => {
    if (!state.renderTarget) {
      // Create the render target if it doesn't exist
      const rt = React.createElement('canvas');
      dispatch(dlabActions.setRenderTarget(rt));
    }
  }, [state.options]);

  useEffect(() => {
    const opt = state.options;

    if (opt.image.element) {
      // Get the DOM element for the render target canvas
      const rt = imageArea?.querySelector('canvas');
      if (!rt) return;

      const [iw, ih] = [opt.image.info.width, opt.image.info.height];
      let [wNew, hNew] = [0, 0];

      switch (opt.resize.mode) {
        case DlabResizeMode.KeepOriginalSize:
          wNew = iw;
          hNew = ih;
          break;
        case DlabResizeMode.ForceResize:
          wNew = opt.resize.x;
          hNew = opt.resize.y;
          break;
        case DlabResizeMode.FitToSize: {
          const wRatio = Math.min((opt.resize.x || 0) / iw, 1);
          const hRatio = Math.min((opt.resize.y || 0) / ih, 1);
          const resizeFactor = Math.min(wRatio, hRatio);

          wNew = ~~(iw * resizeFactor);
          hNew = ~~(ih * resizeFactor);
          break;
        }
      }

      if (wNew !== rt.width || hNew !== rt.height) {
        rt.width = wNew;
        rt.height = hNew;
      }
      rt.style.width = `${state.view.scale * rt.width / 16}rem`;

      // Support for live render in WebGL mode only
      if (opt.process.device === DitherLabDevice.GL && opt.liveRender) render();
      else {
        dispatch(dlabActions.setStatus({
          ...state.status,
          renderStatus: DlabRenderStatus.Ready,
          renderWidth: rt.width,
          renderHeight: rt.height
        }));
      }
    }
  }, [state.options, state.renderTarget]);

  const render = () => {
    const rt = imageArea?.querySelector('canvas');
    const prog = state.options.process.process;
    if (!rt || !prog) return;

    const start = Date.now();
    const control = {};
    prog.run(rt, state.options, control)
      .then(() => dispatch(dlabActions.setStatus({
        renderStatus: DlabRenderStatus.Done,
        lastRenderTime: Date.now() - start,
        renderWidth: rt.width,
        renderHeight: rt.height
      })));

    dispatch(dlabActions.setRenderStatus(DlabRenderStatus.Rendering));
    dispatch(dlabActions.setRenderControl(control));
  };

  const stopRender = () => {
    if (state.renderControl.stop)
      state.renderControl.stop();

    dispatch(dlabActions.setRenderStatus(DlabRenderStatus.Stopped));
  };

  const pan = (ev: Event) => {
    const mev = ev as MouseEvent;
    if (!(mev.buttons & 1)) return;

    imageArea?.scrollBy(-mev.movementX, -mev.movementY);
  };

  const save = () => {
    // Get the DOM element for the render target canvas
    const rt = imageArea?.querySelector('canvas');
    if (!rt) return;

    const dataUrl = rt.toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.setAttribute('download', 'result.png');
    link.setAttribute('href', dataUrl);
    link.click();
  };

  const menuSelect = (id: string) => {
    console.log(id);
    switch (id) {
      case 'file/open':
        (toolPane?.querySelector('input[type=file]') as HTMLElement).click();
        break;
      case 'file/save':
        save();
        break;
      case 'file/exit':
        globalDispatch(destroyWindow(props.windowId));
        break;
      case 'help/help':
        globalDispatch(createWindow(createHelpWindow('help/programs/dlab')));
        break;
      default:
        if (dlabState.actions.includes(id))
          dispatch({ type: id, payload: null });
        else console.log('no action found');
        break;
    }
  };

  const busy = state.status.renderStatus === DlabRenderStatus.Rendering;
  return (
    <div className='dlab-root'>
      <div className="dlab-menu-bar">
        <MenuBar menus={dlabMenus} onSelect={id => menuSelect(id)} />
      </div>

      <div className='dlab-content bevel content'>
        <div className='dlab-control-bar bevel'>
          <div className='dlab-control dlab-control-save'>
            <button className='bevel light hover icon-button' onClick={save}>
              <img src={icon_save} alt='Save' />
            </button>
          </div>

          <div className='dlab-control dlab-control-view'>
            <span>Zoom</span>
            <div className='bevel content'>
              <button className='bevel'
                onClick={() => dispatch(dlabActions.zoomOut())}
                disabled={state.view.scale <= 1}>-</button>
              <input type='text' readOnly value={`${state.view.scale * 100}%`} />
              <button className='bevel'
                onClick={() => dispatch(dlabActions.zoomIn())}
                disabled={state.view.scale >= 16}>+</button>
            </div>
          </div>

          <hr className='divider bevel vertical' />

          <div className='dlab-control dlab-control-render'>
            <input type='checkbox' id='dlab-live-render' name='dlab-live-render'
              checked={state.options.liveRender}
              disabled={state.options.process.device === DitherLabDevice.CPU}
              onChange={(e) => dispatch(dlabActions.setLiveRender(
                (e.nativeEvent.target as HTMLInputElement).checked))} />
            <label htmlFor='dlab-live-render'>Live Render</label>

            <button className='bevel' disabled={!state.options.image.element}
              onClick={() => busy ? stopRender() : render()}>
              {busy ? ' Stop ' : 'Render'}
            </button>
          </div>
        </div>

        <div className='dlab-image-area' ref={el => imageArea = el}
          onMouseMove={(e) => pan(e.nativeEvent)} >
          {state.options.image.element ?
            state.renderTarget :
            <span>[No image loaded]</span>}
        </div>

        <div className='dlab-tool-pane'
          ref={el => toolPane = el}>

          {/* Image upload, preview and properties */}
          <CollapsablePanel title='Source Image'>
            <DitherLabImageOptions
              slice={state.options.image}
              dispatch={dispatch} />
          </CollapsablePanel>

          {/* Image resizing */}
          <CollapsablePanel title='Resize'>
            <DitherLabResizeOptions
              slice={state.options.resize}
              dispatch={dispatch} />
          </CollapsablePanel>

          {/* Color palette selection */}
          <CollapsablePanel title='Color Palette'>
            <DitherLabPaletteOptions
              slice={state.options.palette}
              dispatch={dispatch} />
          </CollapsablePanel>

          {/* Process selection */}
          <CollapsablePanel title='Process'>
            <DitherLabProcessOptions
              slice={state.options.process}
              dispatch={dispatch} />
          </CollapsablePanel>
        </div>

        {state.view.showEditor &&
          <div className='dlab-tool-pane dlab-editor-pane'>
            <ClosablePanel title='Palette Editor'
              onClosed={() => dispatch(dlabActions.hidePaletteEditor())}>
              <DitherLabEditorPane
                slice={state.options.palette}
                dispatch={dispatch} />
            </ClosablePanel>
          </div>}
      </div>

      <div className='dlab-status-bar'>
        <div className='dlab-status bevel inset light'>
          {state.status.renderStatus}
          {state.status.renderStatus === DlabRenderStatus.Done &&
            ` (${state.status.lastRenderTime}ms)`}
        </div>
        <div className='dlab-status bevel inset light'>
          {state.status.renderWidth ?
            `${state.status.renderWidth}x${state.status.renderHeight}` : ''}
        </div>
      </div>
    </div>
  );
}

export default DitherLab;