import 'regenerator-runtime/runtime';
import ReactDOM from 'react-dom';
import makeAppMarkup from './app-markup';
import saga from './saga';
import createStore from './store';

const store = createStore({ saga });
const onCountdownRequest = time => {
  store.dispatch({ type: 'COUNTDOWN_REQUESTED', payload: { time } });
};

ReactDOM.render(
  makeAppMarkup({ onCountdownRequest }),
  document.querySelector('#root'),
);
