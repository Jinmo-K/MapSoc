import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const GuestRoute: React.FC<any> = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route {...rest} render={props => (
    (isLoggedIn)
      ? <Redirect to='/dashboard' />
      : <Component {...props} />
  )} />
);
