import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import DataStore from 'nedb';
import App from './components/App';
import './app.global.css';

const { version } = require('./package.json');
const { remote, ipcRenderer } = window.require('electron');

const userPath = remote.app.getPath('userData');

let usersdb = new DataStore({ filename: userPath+'/data/users.db', autoload: true });

const appQuit = () => {
    if( ipcRenderer ){
        ipcRenderer.send('app:quit');
    }
}

const appMinimize = () => {
    if( ipcRenderer ){
        ipcRenderer.send('app:minimize');
    }
}

const appMaximize = () => {
    if( ipcRenderer ){
        ipcRenderer.send('app:maximize');
    }
}

render(
  <AppContainer>
    <App version={version} db={usersdb} close={appQuit} minimize={appMinimize} maximize={appMaximize} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextRoot = require('./components/App'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <App db={usersdb} close={appQuit} minimize={appMinimize} maximize={appMaximize} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
