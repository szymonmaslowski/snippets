import React from 'react';

const makeColorGetter = ({ color, fired }) => inactiveColorName => {
  if (!fired) return inactiveColorName;
  return ['red', 'yellow', 'green'].includes(color) ? color : 'red';
};

const getStyles = ({ color, fired }) => {
  const getColor = makeColorGetter({ color, fired });
  return {
    backgroundColor: getColor('lightgray'),
    boxShadow: `0 0 20px ${getColor('transparent')}`,
    borderRadius: '50%',
    height: 100,
    width: 100,
  };
};

const Light = ({ color, fired }) => <div style={getStyles({ color, fired })} />;

export default Light;
