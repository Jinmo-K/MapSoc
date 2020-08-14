import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, BrowserRouter as Router, Switch } from 'react-router-dom';

import { store } from './store';
import App from './App';
import { Dashboard, PrivateRoute, GuestRoute, Home, Signup, Login } from './components';
import './index.css';

// Silence logging in production
if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development'){
    if(!window.console) window.console = {};
    var methods = ["debug", "warn", "info"];
    for(let method of methods){
        console[method] = () => {};
    }
}

render(
  <Provider store={store}>
    <Router>
      <App>
        <Switch>
          <GuestRoute exact path='/' component={Home} />
          <GuestRoute path='/login' component={Login} />
          <GuestRoute path='/signup' component={Signup} />
          <PrivateRoute path='/dashboard' component={Dashboard} />
          <Redirect to='/' />
        </Switch>
      </App>
    </Router>
  </Provider>,
  document.getElementById('app')
);
