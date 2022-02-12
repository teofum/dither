import React, { useEffect, useReducer } from 'react';
import CollapsablePanel from '../../ui/collapsablePanel/CollapsablePanel';
import DitherLabImageOptions from './options/DitherLabImageOptions';
import DitherLabResizeOptions from './options/DitherLabResizeOptions';
import DitherLabPaletteOptions from './options/DitherLabPaletteOptions';
import DitherLabProcessOptions from './options/DitherLabProcessOptions';

import { DitherLabActionType } from './DitherLab.action';
import dlabReducer from './DitherLab.reducer';
import { dlabInitialState, DlabRenderStatus, DlabResizeMode } from './DitherLab.state';

import icon_save from '../../../assets/icon/save.png';
import './DitherLab.css';
import { DitherLabDevice } from './DitherLabProgram';

function DitherLab() {
  let imageArea: HTMLDivElement | null = null;

  const [state, dispatch] = useReducer(dlabReducer, dlabInitialState);

  useEffect(() => {
    const ia = imageArea;
    const rt = ia?.querySelector('canvas');
    if (!ia || !rt) return;

    rt.style.width = `${state.view * rt.width / 16}rem`;

    const iaHasScroll = (
      ia.scrollWidth > ia.clientWidth ||
      ia.scrollHeight > ia.clientHeight);

    if (iaHasScroll) ia.classList.add('__scroll');
    else ia.classList.remove('__scroll');
  }, [state.view]);

  useEffect(() => {
    console.log('destroy');
    // Destroy render target on device change
    dispatch({ type: DitherLabActionType.RenderTarget, payload: undefined });
  }, [state.options.process.device]);

  useEffect(() => {
    if (!state.renderTarget) {
      console.log('create');
      // Create the render target if it doesn't exist
      const rt = React.createElement('canvas');
      dispatch({ type: DitherLabActionType.RenderTarget, payload: rt });
    }
  }, [state.options]);

  useEffect(() => {
    const opt = state.options;

    if (opt.image.element) {
      console.log('check');
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
        console.log(`resize ${wNew} ${hNew} ${rt.width} ${rt.height}`);
        rt.width = wNew;
        rt.height = hNew;
      }
      rt.style.width = `${state.view * rt.width / 16}rem`;

      // Support for live render in WebGL mode only
      if (opt.process.device === DitherLabDevice.GL && opt.liveRender) render();
      else dispatch({
        type: DitherLabActionType.Status,
        payload: {
          ...state.status,
          renderStatus: DlabRenderStatus.Ready,
          renderWidth: rt.width,
          renderHeight: rt.height
        }
      });
    }
  }, [state.options, state.renderTarget]);

  const render = () => {
    const rt = imageArea?.querySelector('canvas');
    const prog = state.options.process.process;
    if (!rt || !prog) return;

    const start = Date.now();
    dispatch({
      type: DitherLabActionType.Status,
      payload: {
        ...state.status,
        renderStatus: DlabRenderStatus.Rendering
      }
    });
    prog.run(rt, state.options)
      .then(() => {
        const time = Date.now() - start;
        dispatch({
          type: DitherLabActionType.Status,
          payload: {
            ...state.status,
            renderStatus: DlabRenderStatus.Done,
            lastRenderTime: time,
            renderWidth: rt.width,
            renderHeight: rt.height
          }
        });
      });
  };

  const zoomOut = () => {
    if (state.view > 1)
      dispatch({
        type: DitherLabActionType.View,
        payload: state.view > 4 ? state.view / 2 : state.view - 1
      });
  };

  const zoomIn = () => {
    if (state.view < 16)
      dispatch({
        type: DitherLabActionType.View,
        payload: state.view < 4 ? state.view + 1 : state.view * 2
      });
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

  return (
    <div className='dlab-root'>
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
              <button className='bevel' onClick={zoomOut} disabled={state.view <= 1}>-</button>
              <input type='text' readOnly value={`${state.view * 100}%`} />
              <button className='bevel' onClick={zoomIn} disabled={state.view >= 16}>+</button>
            </div>
          </div>

          <hr className='divider bevel vertical' />

          <div className='dlab-control dlab-control-render'>
            <input type='checkbox' id='dlab-live-render' name='dlab-live-render'
              checked={state.options.liveRender}
              disabled={state.options.process.device === DitherLabDevice.CPU}
              onChange={(e) => dispatch({
                type: DitherLabActionType.Live,
                payload: (e.nativeEvent.target as HTMLInputElement).checked
              })} />
            <label htmlFor='dlab-live-render'>Live Render</label>

            <button className='bevel' onClick={render}
              disabled={!state.options.image.element ||
                state.status.renderStatus === DlabRenderStatus.Rendering}>
              Render
            </button>
          </div>
        </div>

        <div className='dlab-image-area' ref={el => imageArea = el}
          onMouseMove={(e) => pan(e.nativeEvent)} >
          {state.options.image.element ?
            state.renderTarget :
            <span>[No image loaded]</span>}
        </div>

        <div className='dlab-tool-pane'>

          {/* Image upload, preview and properties */}
          <CollapsablePanel title='Source Image'>
            <DitherLabImageOptions
              options={state.options.image}
              onChange={(val) => dispatch({
                type: DitherLabActionType.Image,
                payload: val
              })} />
          </CollapsablePanel>

          {/* Image resizing */}
          <CollapsablePanel title='Resize'>
            <DitherLabResizeOptions
              options={state.options.resize}
              onChange={(val) => dispatch({
                type: DitherLabActionType.Resize,
                payload: val
              })} />
          </CollapsablePanel>

          {/* Color palette selection */}
          <CollapsablePanel title='Color Palette'>
            <DitherLabPaletteOptions
              options={state.options.palette}
              onChange={(val) => dispatch({
                type: DitherLabActionType.Palette,
                payload: val
              })} />
          </CollapsablePanel>

          {/* Process selection */}
          <CollapsablePanel title='Process'>
            <DitherLabProcessOptions
              options={state.options.process}
              onChange={(val) => dispatch({
                type: DitherLabActionType.Process,
                payload: val
              })} />
          </CollapsablePanel>
        </div>
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