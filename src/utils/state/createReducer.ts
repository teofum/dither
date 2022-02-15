import produce, { Draft } from 'immer';
import Action from './Action';
import ReducerFn from './ReducerFn';

export type ReducerTemplate<T> = (state: Draft<T>, action: Action) => any;

const createReducer = <T>(reducers: { [key: string]: ReducerTemplate<T> }): ReducerFn<T> => {
  const keys = Object.keys(reducers);

  return (state: T, action: Action) => {
    console.log(action.type, action.payload);
    if (keys.includes(action.type))
      return produce(state, draft => {reducers[action.type](draft, action);});
    else return state;
  };
};

export default createReducer;