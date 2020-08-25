import { AppThunk } from '../store';
import { userService } from '../../services';
import { userConstants } from '../../constants';
import { IUser } from '../../types';


export {
  loginSuccess,
  login, 
  logout,
  signup 
};


/* ------------------------------ Action Types ------------------------------ */

interface ILoginFailureAction {
  type: typeof userConstants.LOGIN_FAILURE;
  errors: Record<string, string>;
}

interface ILoginSuccessAction {
  type: typeof userConstants.LOGIN_SUCCESS;
  user: IUser;
}

interface ILogoutAction {
  type: typeof userConstants.LOGOUT;
}

export type AuthAction = ILoginSuccessAction | ILoginFailureAction | ILogoutAction;


/* --------------------------------- Actions -------------------------------- */

const loginSuccess = (user: IUser): AuthAction => ({
  type: userConstants.LOGIN_SUCCESS,
  user
});

const loginFailure = (errors: Record<string,string>): AuthAction => ({
  type: userConstants.LOGIN_FAILURE,
  errors
});

const logoutAction = (): AuthAction => ({
  type: userConstants.LOGOUT
});


/* --------------------------------- Thunks --------------------------------- */

const login = (email: string, password: string): AppThunk => (dispatch) => {
  userService.login(email, password)
    .then(res => {
      userService.setAuthToken(res.data.token);
      dispatch(loginSuccess(res.data.user));
      window.location.href = '/';
    })
    .catch(console.log);
};

const logout = (): AppThunk => (dispatch) => {   
  dispatch(logoutAction());
  userService.logout(); 
  // window.location.href = '/';
};

const signup = (user: IUser): AppThunk => (dispatch) => {
  // TODO: alert, error dispatch
  userService.signup(user)
    .then(() => {
      window.location.href = '/login';
    })
    .catch(console.log);
};
