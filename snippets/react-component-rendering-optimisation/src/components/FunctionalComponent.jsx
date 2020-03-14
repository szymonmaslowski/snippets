import React, { useRef } from 'react';
import { Body } from '../utils';

const FunctionalComponent = () => {
  const rendersRef = useRef(0);
  rendersRef.current += 1;
  console.info('render Functional');
  return (
    <Body
      componentName="FunctionalComponent"
      rendersCount={rendersRef.current}
    />
  );
};

export default FunctionalComponent;
