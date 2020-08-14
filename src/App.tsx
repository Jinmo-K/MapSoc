import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { RootState } from './store/reducers';
import { Navbar } from './components';

import './App.css';


interface IAppProps extends PropsFromRedux {
}

const App: React.FC<IAppProps> = ({ auth, children}) => {
  const location = useLocation();

  return (
    <div id='app'>
      {/* Navbar */}
      {
        (location.pathname !== '/')
        && <Navbar isLoggedIn={auth.isLoggedIn} />
      }

      {/* Routes */}
      {React.cloneElement(children as JSX.Element, {isLoggedIn: auth.isLoggedIn})}
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
