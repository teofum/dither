import React from 'react';
import ComboBox from '../../../ui/comboBox/ComboBox';
import { ProcessOptions } from '../DitherLab.state';
import { DitherLabDevice, DitherLabProgramSettingType } from '../utils/DitherLabProgram';
import programs from '../assets/programs';
import OptionsProps from './options.props';
import dlabActions from '../DitherLab.action';

const devOptions = Object.values(DitherLabDevice)
  .filter(val => programs.filter(p => p.device === val).length > 0)
  .map(val => ({ name: val, value: val }));

function DitherLabProcessOptions(props: OptionsProps<ProcessOptions>) {
  const { device, process, settingValues } = props.slice;

  const updateSetting = (setting: string, value: number) => {
    props.dispatch(dlabActions.setProcSetting({
      setting,
      value
    }));
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
    .filter(prog => prog.device === device)
    .map(prog => ({ name: prog.name, value: prog }));

  const settings = process?.settings || {};
  const setKeys = Object.keys(settings);

  return (
    <div className='dlab-process-root'>
      <span className='dlab-process-label'>Device</span>
      <ComboBox options={devOptions} value={device}
        onChange={(e) => props.dispatch(dlabActions.setDevice(e.selected.value))} />

      <span className='dlab-process-label'>Process&nbsp;</span>
      <ComboBox options={progOptions} value={process}
        onChange={(e) => {
          props.dispatch(dlabActions.setProcess(e.selected.value));
          props.dispatch(dlabActions.setProcSettings({}));
        }} />

      {setKeys.length > 0 && <hr className='divider bevel horizontal' />}
      {setKeys.map(key => {
        let control: JSX.Element;

        const setting = settings[key];
        const valOrDefault = def(settingValues[key], setting.default);

        switch (setting.type) {
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
                value={settingValues[key]}
                options={setting.options || []}
                onChange={(e) => updateSetting(key, e.selected.value)} />
            );
            break;
          case DitherLabProgramSettingType.Range:
            control = (
              <div className='dlab-process-control' key={key}>
                <input type='range'
                  min={setting.min || 0}
                  max={setting.max || 1}
                  step={setting.step}
                  value={valOrDefault}
                  onInput={(e) => updateSetting(key,
                    parseFloat((e.target as HTMLInputElement).value)
                  )} />
                {setting.showValue &&
                  <span style={setting.valueColor ?
                    { color: setting.valueColor(valOrDefault || 0) } :
                    {}
                  }>
                    {setting.showValue(valOrDefault || 0)}
                  </span>}
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