import React from 'react';
import ReactDOM from 'react-dom'
import App from './App';

ReactDOM.hydrate(<App />, document.getElementById('root'));

if (process.env.NODE_ENV === 'development') {
  module.hot.accept();
}
