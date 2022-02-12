import React from 'react';
import readableFileSize from '../../../../utils/etc/readableFileSize';
import { ImageOptions } from '../DitherLab.state';
import OptionsProps from './options.props';

import '../DitherLab.css';

function DitherLabImageOptions(props: OptionsProps<ImageOptions>) {
  let hiddenInput: HTMLInputElement | null = null;

  const update = (newState: ImageOptions) => {
    props.onChange(newState);
  };

  const uploadImage = (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    if (input?.files) {
      const file = input.files[0];

      update({
        ...props.options,
        info: {
          ...props.options.info,
          src: URL.createObjectURL(file),
          filename: file.name,
          meta: [
            { prop: 'Size (bytes)', value: readableFileSize(file.size) }
          ]
        },
        element: null
      });
    }
  };

  const onImageLoad = (ev: Event) => {
    const img = ev.target as HTMLImageElement;
    update({
      ...props.options,
      info: {
        ...props.options.info,
        width: img.naturalWidth,
        height: img.naturalHeight,
        meta: [
          ...props.options.info.meta,
          { prop: 'Dimensions', value: `${img.naturalWidth}x${img.naturalHeight}` }
        ]
      },
      element: img
    });
  };

  return (
    <div className='dlab-image-root'>
      <input type='file' style={{ display: 'none' }}
        ref={el => hiddenInput = el}
        onChange={(e) => uploadImage(e.nativeEvent)} />

      <span className='dlab-image-filename'>
        {props.options.info.filename || 'No image'}
      </span>
      <button className='dlab-image-upload-button bevel'
        onClick={() => hiddenInput?.click()}>
        Browse...
      </button>
      <div className='dlab-image-preview bevel inset light'>
        {props.options.info.src ?
          <img src={props.options.info.src} onLoad={(e) => onImageLoad(e.nativeEvent)} /> :
          <span>No preview available</span>}
      </div>

      <div className='dlab-image-meta'>
        {props.options.info.meta.map((meta, i) => (
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