const userUrl = '/api/users/';

export const userConstants = {
  // ACTION TYPES
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER_FAILURE: 'UPDATE_USER_FAILURE',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',

  // API
  LOGIN_ENDPOINT: userUrl  + 'login',
  SIGNUP_ENDPOINT: userUrl + 'signup',
  USERS_ENDPOINT: userUrl,
} as const;
