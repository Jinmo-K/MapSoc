import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { RootState } from './store/reducers';
import { Dashboard, Navbar, PrivateRoute, Home, Signup, Login } from './components';

import './App.css';


interface IAppProps extends PropsFromRedux {
}

const App: React.FC<IAppProps> = ({ auth, }) => {
  return (
    <div id='app'>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/login'>
            {
              (auth.isLoggedIn)
                ? <Redirect to='/dashboard' />
                : <Login />
            }
          </Route>
          <Route path='/signup'>
            {
              (auth.isLoggedIn)
                ? <Redirect to='/dashboard' />
                : <Signup />
            }
          </Route>
          <PrivateRoute path='/dashboard' component={Dashboard} />
          <Redirect to='/' />
        </Switch>
      </Router>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
