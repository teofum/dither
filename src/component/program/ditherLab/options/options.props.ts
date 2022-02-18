import React from 'react';
import Action from '../../../../utils/state/Action';

interface OptionsProps<T> {
  slice: T;
  dispatch: React.Dispatch<Action>;
}

export default OptionsProps;