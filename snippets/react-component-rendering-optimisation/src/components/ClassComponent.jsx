import React from 'react';
import { Body } from '../utils';

class ClassComponent extends React.Component {
  renders = 0;

  render() {
    this.renders += 1;
    console.info('render ClassComponent');
    return <Body componentName="ClassComponent" rendersCount={this.renders} />;
  }
}

export default ClassComponent;
