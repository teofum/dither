import React from 'react';
import readableFileSize from '../../../../utils/etc/readableFileSize';
import { useAppDispatch } from '../../../../hooks';
import { ImageOptions } from '../DitherLab.state';
import dlabActions from '../DitherLab.action';
import OptionsProps from './options.props';

import '../DitherLab.css';
import { setWindowTitle } from '../../../ui/windowManager/windowSlice';

function DitherLabImageOptions(props: OptionsProps<ImageOptions> & { windowId: number }) {
  const globalDispatch = useAppDispatch();
  const { info } = props.slice;
  let hiddenInput: HTMLInputElement | null = null;

  const uploadImage = (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    if (input?.files) {
      const file = input.files[0];

      props.dispatch(dlabActions.setImageElement(null));
      props.dispatch(dlabActions.setImageInfo({
        ...info,
        src: URL.createObjectURL(file),
        filename: file.name,
        meta: [
          { prop: 'Size (bytes)', value: readableFileSize(file.size) }
        ]
      }));

      globalDispatch(setWindowTitle({
        windowId: props.windowId,
        title: `${file.name} - DitherLab`
      }));
    }
  };

  const onImageLoad = (ev: Event) => {
    const img = ev.target as HTMLImageElement;

    props.dispatch(dlabActions.setImageElement(img));
    props.dispatch(dlabActions.setImageInfo({
      ...info,
      width: img.naturalWidth,
      height: img.naturalHeight,
      meta: [
        ...info.meta,
        { prop: 'Dimensions', value: `${img.naturalWidth}x${img.naturalHeight}` }
      ]
    }));
  };

  return (
    <div className='dlab-image-root'>
      <input type='file' style={{ display: 'none' }}
        ref={el => hiddenInput = el}
        onChange={(e) => uploadImage(e.nativeEvent)} />

      <span className='dlab-image-filename'>
        {info.filename || 'No image'}
      </span>
      <button className='dlab-image-upload-button bevel'
        onClick={() => hiddenInput?.click()}>
        Browse...
      </button>
      <div className='dlab-image-preview bevel inset light'>
        {info.src ?
          <img src={info.src} onLoad={(e) => onImageLoad(e.nativeEvent)} /> :
          <span>No preview available</span>}
      </div>

      <div className='dlab-image-meta'>
        {info.meta.map((meta, i) => (
          <div key={i} className='dlab-image-meta-item'>
            <span className='dlab-image-meta-name'>{meta.prop}</span>
            <span className='dlab-image-meta-value'>{meta.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DitherLabImageOptions;