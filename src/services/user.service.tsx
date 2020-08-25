import axios from 'axios';
import { userConstants } from '../constants';
import { IUser } from '../types';

export const userService = {
  setAuthToken,
  get,
  update,
  login,
  logout,
  signup,
};

function setAuthToken(token: string) {
  localStorage.token = token;
  axios.defaults.headers.common['Authorization'] = token;
}

// API --------------------------

function get(userId: number) {
  return axios.get(userConstants.USERS_ENDPOINT + userId);
}

function update(userId: number, values: Record<string, string>) {
  return axios.put(userConstants.USERS_ENDPOINT + userId, values);
}

// Auth --------------------------

function login(username: string, password: string) {
  return axios.post(userConstants.LOGIN_ENDPOINT, {username, password});
}

function logout() {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
}

function signup(user: IUser) {
  return axios.post(userConstants.SIGNUP_ENDPOINT, user);
}
