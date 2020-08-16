import { initialState } from './logic';
import makePaint from './view';
import './index.css';

const paint = makePaint(document.querySelector('#root'));
const start = () => paint({ reset: start, state: initialState });
start();
