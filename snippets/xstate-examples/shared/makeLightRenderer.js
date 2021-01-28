const makeStyles = color => `\
  background-color: ${color};\
  box-shadow: 0 0 20px ${color};\
  border-radius: 50%;\
  height: 100px;\
  width: 100px;\
`;

const makeRender = rootElement => color => {
  const styles = makeStyles(color);
  // eslint-disable-next-line no-param-reassign
  rootElement.innerHTML = `<div style="${styles}" />`;
};

export default makeRender;
