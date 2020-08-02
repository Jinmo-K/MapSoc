import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './store';
import App from './App';
import './index.css';

// Silence logging in production
if(process.env.NODE_ENV === 'production'){
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for(let method of methods){
        console[method] = () => {};
    }
}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
