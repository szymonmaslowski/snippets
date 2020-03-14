import React from 'react';
import { Body } from '../utils';

class ClassPureComponent extends React.PureComponent {
  renders = 0;

  render() {
    this.renders += 1;
    console.info('render ClassPureComponent');
    return (
      <Body componentName="ClassPureComponent" rendersCount={this.renders} />
    );
  }
}

export default ClassPureComponent;
