import React from 'react';

const makeAppMarkup = ({ onCountdownRequest }) => (
  <button type={'button'} onClick={() => onCountdownRequest(5)}>
    Begin countdown!
  </button>
);

export default makeAppMarkup;
