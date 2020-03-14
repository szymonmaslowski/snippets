import React from 'react';

const Body = ({ componentName, rendersCount }) => (
  <div
    style={{
      background: rendersCount > 1 ? 'red' : 'lightgreen',
      padding: 10,
    }}
  >
    {componentName} - renders count: <strong>{rendersCount}</strong>
  </div>
);

export default Body;
