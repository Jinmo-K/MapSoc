import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation, Switch } from 'react-router-dom';

import { RootState } from './store/reducers';
import { Navbar } from './components';

import './App.css';


interface IAppProps extends PropsFromRedux {
  children: JSX.Element
}

const App: React.FC<IAppProps> = ({ auth, children }) => {
  const location = useLocation();

  return (
    <div id='app'>
      {/* Navbar */}
      {
        (location.pathname !== '/')
        && <Navbar isLoggedIn={auth.isLoggedIn} />
      }

      {/* Routes */}
      <Switch>
      {
        React.Children.map(children, child => {
          return React.cloneElement(child as JSX.Element, {isLoggedIn: auth.isLoggedIn});
        })
      }
      </Switch>
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
