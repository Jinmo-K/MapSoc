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
  user: {}
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
      return {
        errors: {},
        isLoggedIn: false,
        user: {}
      };

    case userConstants.RESET_USER_ERRORS:
      return {
        ...state,
        errors: {}
      };

    case userConstants.UPDATE_USER_FAILURE:
      return {
        ...state,
        errors: action.errors,
      };

    case userConstants.UPDATE_USER_SUCCESS:
      return {
        ...state,
        errors: {},
        user: action.user
      };

    default:
      return state;
  }
};
