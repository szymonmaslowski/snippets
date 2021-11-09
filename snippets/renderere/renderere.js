const fallbackComponent = () => '';
const refs = new Set();
const cleanups = new Set();
let counter = 0;

const getId = () => {
  const currentId = counter;
  counter += 1;
  return currentId;
};

const hook = callback => {
  const id = getId();
  refs.add({
    id,
    callback,
  });
  return `data-ref="${id}"`;
};

const makeComponent = (component = fallbackComponent) => ({
  children,
  ...restProps
} = {}) =>
  component(
    {
      ...restProps,
      children: Array.isArray(children) ? children.join('') : children,
    },
    { hook },
  );

const render = (tree, element) => {
  cleanups.forEach(cleanup => cleanup());
  cleanups.clear();
  // eslint-disable-next-line no-param-reassign
  element.innerHTML = tree;
  refs.forEach(({ id, callback }) => {
    const refElement = element.querySelector(`[data-ref="${id}"]`);
    const cleanup = callback(refElement) || (() => {});
    cleanups.add(cleanup);
  });
  refs.clear();
};

export { makeComponent, render };
