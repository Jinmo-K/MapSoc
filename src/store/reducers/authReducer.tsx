import { AuthAction, UserAction } from '../actions';
import { userConstants } from '../../constants';
import { IUser } from '../../types';

interface AuthState {
  errors: Record<string, string>;
  isLoggedIn: boolean;
  user: IUser;
}

const initialState: AuthState = {
  errors: {},
  isLoggedIn: false,
  user: {},
};

export default (state = initialState, action: AuthAction | UserAction): AuthState => {
  switch(action.type) {
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        errors: action.errors
      };
    
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        errors: {},
        isLoggedIn: true,
        user: action.user
      };
  
    case userConstants.LOGOUT:
      return initialState;

    case userConstants.UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.user
      };

    default:
      return state;
  }
};
