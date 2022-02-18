import createReducer, { ReducerTemplate } from './createReducer';

type ReducerOrGroup<T> = ReducerTemplate<T> | { [key: string]: ReducerOrGroup<T> };

const isReducer = <T>(thing: ReducerOrGroup<T>): thing is ReducerTemplate<T> => typeof thing === 'function';

const flattenReducers = <T>(reducers: { [key: string]: ReducerOrGroup<T> }) => {
  const flat: { [key: string]: ReducerTemplate<T> } = {};

  Object.keys(reducers).forEach(key => {
    const rog = reducers[key];
    if (isReducer(rog)) flat[key] = rog;
    else {
      const nl = flattenReducers(rog);
      Object.keys(nl).forEach(nlKey =>
        flat[`${key}/${nlKey}`] = nl[nlKey]);
    }
  });

  return flat;
};

const createReducerAndActions = <T>(reducers: { [key: string]: ReducerOrGroup<T> }) => {
  const flat = flattenReducers(reducers);
  const actions: string[] = Object.keys(flat);
  const reducer = createReducer(flat);

  return { reducer, actions };
};

export default createReducerAndActions;