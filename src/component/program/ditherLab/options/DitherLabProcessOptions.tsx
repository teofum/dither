import React from 'react';
import ComboBox from '../../../ui/comboBox/ComboBox';
import { ProcessOptions } from '../DitherLab.state';
import { DitherLabDevice, DitherLabProgramSettingType } from '../DitherLabProgram';
import programs from '../programs';
import OptionsProps from './options.props';

const devOptions = Object.values(DitherLabDevice)
  .filter(val => programs.filter(p => p.device === val).length > 0)
  .map(val => ({ name: val, value: val }));

function DitherLabProcessOptions(props: OptionsProps<ProcessOptions>) {
  const update = (newState: ProcessOptions) => {
    props.onChange(newState);
  };

  const updateSetting = (key: string, value: number) => {
    update({
      ...props.options,
      settingValues: {
        ...props.options.settingValues,
        [key]: value
      }
    });
  };

  const blockNonDigits = (ev: Event) => {
    const key = (ev as KeyboardEvent).key;
    if (key !== 'Backspace' && !key.match(/[0-9]/) && !key.startsWith('Arrow'))
      ev.preventDefault();
  };

  const def = (ev?: number, def?: number) => {
    return ev !== undefined ? ev : def;
  };

  const progOptions = programs
    .filter(prog => prog.device === props.options.device)
    .map(prog => ({ name: prog.name, value: prog }));

  const settings = props.options.process?.settings || {};
  const setKeys = Object.keys(settings);

  return (
    <div className='dlab-process-root'>
      <span className='dlab-process-label'>Device</span>
      <ComboBox options={devOptions} value={props.options.device}
        onChange={(e) => update({
          ...props.options,
          device: e.selected.value
        })} />

      <span className='dlab-process-label'>Process</span>
      <ComboBox options={progOptions} value={props.options.process}
        onChange={(e) => update({
          ...props.options,
          process: e.selected.value,
          settingValues: {}
        })} />

      {setKeys.length > 0 && <hr className='divider bevel horizontal' />}
      {setKeys.map(key => {
        let control: JSX.Element;

        const valOrDefault = def(props.options.settingValues[key], settings[key].default);

        switch (settings[key].type) {
          case DitherLabProgramSettingType.Input:
            control = (
              <input type='number' key={key} className='bevel'
                value={valOrDefault}
                onKeyDown={(e) => blockNonDigits(e.nativeEvent)}
                onInput={(e) => updateSetting(key,
                  parseFloat((e.target as HTMLInputElement).value),
                )} />
            );
            break;
          case DitherLabProgramSettingType.Combo:
            control = (
              <ComboBox key={key}
                value={props.options.settingValues[key]}
                options={settings[key].options || []}
                onChange={(e) => updateSetting(key, e.selected.value)} />
            );
            break;
          case DitherLabProgramSettingType.Range:
            control = (
              <div className='dlab-process-control' key={key}>
                <input type='range'
                  min={settings[key].min || 0}
                  max={settings[key].max || 1}
                  step={settings[key].step}
                  value={valOrDefault}
                  onInput={(e) => updateSetting(key,
                    parseFloat((e.target as HTMLInputElement).value)
                  )} />
                {settings[key].showValue &&
                  <span>{valOrDefault?.toPrecision(
                    Math.floor(Math.log10(valOrDefault)) + 2
                  )}</span>}
              </div>
            );
            break;
        }

        return [
          (<span key={key + '_label'} className='dlab-process-label'>{settings[key].name}</span>),
          (control)
        ];
      })}
    </div>
  );
}

export default DitherLabProcessOptions;