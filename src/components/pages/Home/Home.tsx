import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';

import { loadTestGraph, loginSuccess } from '../../../store/actions';
import { GraphBg } from './GraphBg';

import './Home.css';

interface IHomeProps extends PropsFromRedux {
}

export const HomePage: React.FC<IHomeProps> = ({ loadTestGraph, loginSuccess }) => {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  const onDemoClick = () => {
    let demoUser = {
      id: 0,
      name: 'Test User',
      email: 'test@mapsoc.com',
    };
    loginSuccess(demoUser);
    loadTestGraph();
  };

  return (
    <main id='home' className='main-container'>
      <GraphBg width={window.innerWidth} height={window.innerHeight} />
      <h1 className="main-title">
        <span className="thin">Welcome to</span>&ensp;
        {(!isLogoLoaded)
          &&  'MAPSOC'
        }
        <img 
          className='logo' 
          src='/MapSoc-client/logo-big-home.png' 
          alt='Logo' 
          style={!isLogoLoaded ? {width: 0} : {marginLeft: '2px'}}
          onLoad={() => setIsLogoLoaded(true)} 
        />
      </h1>
      <div className='auth-links'>
        <Link to='/login' style={{backgroundColor: 'rgba(137, 188, 219, 0.3)'}}>
          Login
        </Link>
        <Link to='/signup'>
          Sign up
        </Link>
      </div>
      <div className='demo-wrapper'>
        Or check out the <button className='demo-btn' onClick={onDemoClick}>DEMO</button>
      </div>
    </main>
  );
};

const mapDispatchToProps = {
  loadTestGraph,
  loginSuccess
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const Home = connector(HomePage);
