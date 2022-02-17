import React, { useEffect, useState } from 'react';
import { hex, hsl2srgb, luma_srgb, srgb2hsl } from '../../../utils/etc/colorUtils';
import InputProps from '../InputProps';
import './ColorPicker.css';

enum ColorMode {
  RGB = 'RGB',
  HSL = 'HSL'
}

function ColorPicker(props: InputProps<number[]>) {
  const [mode, setMode] = useState(ColorMode.RGB);
  const [tempValue, setTempValue] = useState<number[] | null>(null);
  const [lastValue, setLastValue] = useState<number[] | null>(null);

  useEffect(() => {    
    setTempValue(null);
    
    // Persist last value in selected color space
    // This prevents picker value from 'jumping' upon selecting a color with
    // several picker space but only one RGB representation (eg, HSL with L=0)
    if (lastValue) {
      const same = deconvert(lastValue)
        .every((v, i) => v === props.value[i]);

      if (!same) setLastValue(null);
    }
  }, [props.value, mode]);

  const convert = (color: number[]) => {
    switch (mode) {
      case ColorMode.HSL:
        return srgb2hsl(color);
      default:
        return color;
    }
  };

  const deconvert = (color: number[]) => {
    switch (mode) {
      case ColorMode.HSL:
        return hsl2srgb(color);
      default:
        return color;
    }
  };

  const { value, set } = {
    value: tempValue || lastValue || convert(props.value),
    set: props.onChange
  };

  const setChannel = (channel: number, ev: Event) => {
    if (!value) return;

    const newValue = value.slice();
    newValue[channel] = parseInt((ev.target as HTMLInputElement).value);
    setTempValue(newValue);
  };

  const commitChanges = () => {
    if (tempValue !== null) {
      set(deconvert(tempValue));
      setLastValue(tempValue);
      setTempValue(null);
    }
  };

  const getHueGradient = () => {
    const [, s, l] = value;
    const stops = [0, 60, 120, 180, 240, 300, 360]
      .map(h => `hsl(${h}, ${s}%, ${l}%) ${h / 3.6}%`);

    return `linear-gradient(to right, ${stops.join(', ')})`;
  };

  const getLightGradient = () => {
    const [h, s] = value;
    const stops = [0, 50, 100]
      .map(l => `hsl(${h}, ${s}%, ${l}%) ${l}%`);

    return `linear-gradient(to right, ${stops.join(', ')})`;
  };

  const getSliders = () => {
    return [0, 1, 2].map(i => {
      let max = 255;
      if (mode === ColorMode.HSL) max = i === 0 ? 359 : 100;

      // Dynamically set the slider backgrounds to cool gradients
      const ifmin = value.slice();
      const ifmax = value.slice();
      ifmin[i] = 0;
      ifmax[i] = max;

      let gradient = `linear-gradient(to right, ${hex(deconvert(ifmin))}, ${hex(deconvert(ifmax))})`;
      
      if (mode === ColorMode.HSL) {
        if (i === 0) gradient = getHueGradient();
        else if (i === 2) gradient = getLightGradient();
      }

      const inputStyle = {
        '--gradient': gradient
      };

      return [
        (<input key={`${i}_input`} type="range" min={0} max={max} step={1}
          value={value[i]} style={inputStyle as any}
          onChange={(e) => setChannel(i, e.nativeEvent)} />),
        (<span key={`${i}_value`}>
          {value[i].toFixed(0).padStart(3, ' ' /* &nbsp; */)}
        </span>)
      ];
    });
  };

  const contrastColor = luma_srgb(deconvert(value)) > 0.5 ? 'black' : 'white';
  return (
    <div className='picker-root'
      onMouseUp={commitChanges}
      onKeyUp={commitChanges}
      onTouchEnd={commitChanges}>

      <div className="picker-mode-select wide">
        {Object.keys(ColorMode).map(key => {
          const colorMode = (ColorMode as any)[key];
          return (
            <button key={key} className='bevel'
              onClick={() => setMode(colorMode)}>
              {colorMode}
            </button>
          );
        })}
      </div>

      <div className="picker-preview bevel content wide"
        style={{ background: hex(deconvert(value)), color: contrastColor }}>
        {hex(deconvert(value))}
      </div>

      {getSliders()}
    </div>
  );
}

export default ColorPicker;