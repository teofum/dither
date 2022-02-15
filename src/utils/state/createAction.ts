import Action from './Action';

function createAction<P>(type: string) {
  return (payload: P): Action => ({
    type,
    payload
  });
}

export default createAction;