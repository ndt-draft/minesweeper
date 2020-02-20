import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import store from './store'

const target = document.getElementById('root')

// @see https://github.com/davezuko/react-redux-starter-kit/blob/master/src/main.js
let renderApp = () => {
  const App = require('./App').default

  ReactDOM.render(<App store={store} />, target)
}

// @see https://github.com/facebook/create-react-app/issues/2317
if (module.hot) {
  module.hot.accept(['./App'], () => {
    renderApp()
  })
}

renderApp()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
