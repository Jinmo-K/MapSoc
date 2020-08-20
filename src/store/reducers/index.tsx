import { combineReducers } from 'redux';
import authReducer from './authReducer'
import graphReducer from './graphReducer';


const rootReducer = combineReducers({
  auth: authReducer,
  graph: graphReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
