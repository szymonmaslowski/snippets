import { inspect } from '@xstate/inspect';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

inspect();

ReactDOM.render(<App />, document.querySelector('#root'));
