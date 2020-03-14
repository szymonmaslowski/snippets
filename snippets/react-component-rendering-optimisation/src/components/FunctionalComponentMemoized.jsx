import React, { useRef } from 'react';
import { Body } from '../utils';

const FunctionalComponentMemoized = React.memo(() => {
  const rendersRef = useRef(0);
  rendersRef.current += 1;
  console.info('render FunctionalMemoized');
  return (
    <Body
      componentName="FunctionalComponent"
      rendersCount={rendersRef.current}
    />
  );
});

export default FunctionalComponentMemoized;
