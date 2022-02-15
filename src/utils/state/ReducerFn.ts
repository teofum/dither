import Action from './Action';

type ReducerFn<T> = (state: T, action: Action) => T;

export default ReducerFn;