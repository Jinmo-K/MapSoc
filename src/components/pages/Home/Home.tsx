import React from 'react';
import { Link } from 'react-router-dom';

import './Home.css';
import { GraphBg } from './GraphBg';

interface IHomeProps {

}

export const Home: React.FC<IHomeProps> = () => {
  return (
    <main id='home' className='main-container'>
      <GraphBg width={window.innerWidth} height={window.innerHeight} />
      <h1 className="main-title"><span className="thin">Welcome to</span> MapSoc</h1>
      <div className='auth-links'>
        <Link to='/login' style={{backgroundColor: 'rgba(137, 188, 219, 0.3)'}}>
          Login
        </Link>
        <Link to='/signup'>
          Sign up
        </Link>
      </div>
    </main>
  );
};