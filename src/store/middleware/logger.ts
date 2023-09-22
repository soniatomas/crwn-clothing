import { Middleware } from 'redux';
import { RootState } from '../store';

// The first argument in Middleware<{}, RootState > is for template dispatch extension,
// which is an extra dispatch signature added to the middleware.
// You add the first argument as a type, so if you want to add more onto your dispatch you can
// but we do not need to add an extension so we just pass in an empty object.
export const loggerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (!action.type) {
    return next(action);
  }

  console.log('type: ', action.type);
  console.log('payload: ', action.payload);
  console.log('currentState: ', store.getState());

  next(action);

  console.log('next state: ', store.getState());
};
