import { combineReducers } from 'redux';
import authReducer from './authReducer'
import saveReducer from './saveReducer';


const rootReducer = combineReducers({
  auth: authReducer,
  save: saveReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
