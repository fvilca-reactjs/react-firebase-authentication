import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';
import 'antd/dist/antd.css';

ReactDOM.render(
  <FirebaseContext.Provider value = {new Firebase()}>
    <App/>
    </FirebaseContext.Provider>,
  document.getElementById('root')
);

