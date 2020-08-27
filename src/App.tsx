import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation, Switch } from 'react-router-dom';

import { RootState } from './store/reducers';
import { loadTestGraph, logout } from './store/actions';
import { Modal, ModalContainer, Navbar } from './components';

import './App.css';

interface IAppProps extends PropsFromRedux {
  children: JSX.Element
}

const App: React.FC<IAppProps> = ({ auth, children, loadTestGraph, logout }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const location = useLocation();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  useEffect(() => {
    // loadTestGraph();
  }, [auth.isLoggedIn, loadTestGraph])

  return (
    <div id='app'>
      {/* Navbar */}
      {
        (location.pathname !== '/')
        && <Navbar isLoggedIn={auth.isLoggedIn} logout={logout} toggleModal={toggleModal} />
      }

      {/* Modal */}
      {
        isModalOpen 
        &&  <Modal>
              <ModalContainer toggleModal={toggleModal} />
            </Modal>  
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
  loadTestGraph,
  logout,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
