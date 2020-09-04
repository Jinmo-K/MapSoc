import { AppThunk } from '../store';
import { userService } from '../../services';
import { userConstants } from '../../constants';
import { IUser } from '../../types';


export {
  updateUser,
};


/* ------------------------------ Action Types ------------------------------ */

interface IUpdateUserFailureAction {
  type: typeof userConstants.UPDATE_USER_FAILURE;
  errors: Record<string, string>;
}

interface IUpdateUserSuccessAction {
  type: typeof userConstants.UPDATE_USER_SUCCESS;
  user: IUser;
}

export type UserAction = IUpdateUserFailureAction | IUpdateUserSuccessAction;

/* --------------------------------- Actions -------------------------------- */

const updateUserFailure = (errors: Record<string, string>): UserAction => ({
  type: userConstants.UPDATE_USER_FAILURE,
  errors
});

const updateUserSuccess = (user: IUser): UserAction => ({
  type: userConstants.UPDATE_USER_SUCCESS,
  user
});

/* --------------------------------- Thunks --------------------------------- */

const updateUser = (userId: number, values: Record<string, string>): AppThunk => (dispatch) => {
 
};
