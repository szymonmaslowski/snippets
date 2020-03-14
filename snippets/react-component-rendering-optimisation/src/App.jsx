import React from 'react';
import {
  ClassComponent,
  ClassPureComponent,
  FunctionalComponent,
  FunctionalComponentMemoized,
} from './components';

class App extends React.Component {
  componentDidMount() {
    console.info('App forcing update');
    this.forceUpdate(() => {
      console.info('App updated');
    });
  }

  renders = 0;

  render() {
    console.info('App render');
    this.renders += 1;
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Rendering optimisation</h1>
        <p>
          <span style={{ color: 'red' }}>Red</span> components rendered twice
          (one unnecessary rerender)
        </p>
        <p>
          <span style={{ color: 'green' }}>Green</span> components rendered only
          once
        </p>
        <p style={{ color: 'grey', fontStyle: 'italic' }}>
          Check out the console to see rendering process step by step
        </p>
        <p style={{ textDecoration: 'underline' }}>
          Total App renders count: <strong>{this.renders}</strong>
        </p>
        <FunctionalComponent />
        <FunctionalComponentMemoized />
        <ClassComponent />
        <ClassPureComponent />
      </div>
    );
  }
}

export default App;
