import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute: React.FC<any> = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route {...rest} render={props => (
    (isAuthenticated)
      ? <Component {...props} />
      : <Redirect to='/' />
  )} />
);