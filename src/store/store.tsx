import { createStore, applyMiddleware, Action } from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import rootReducer, { RootState } from './reducers';

export const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
    )
);

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<any>
>;
