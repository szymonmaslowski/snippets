import 'regenerator-runtime/runtime';
import ReactDOM from 'react-dom';
import makeAppMarkup from './app-markup';
import saga from './saga';
import createStore from './store';

const store = createStore({ saga });
ReactDOM.render(makeAppMarkup(store), document.querySelector('#root'));
