import { makeComponent, render } from './renderere';

const Layout = makeComponent(
  ({ children, footer, title }) => `
  <div style="align-items: center; display: flex; flex-direction: column; justify-content: center">
    ${title}
    <div style="border: 4px solid black; padding: 20px">${children}</div>
    ${footer}
  </div>`,
);

const Button = makeComponent(({ children, onClick }, { hook }) => {
  const ref = hook(element => {
    element.addEventListener('click', onClick);
    return () => {
      element.removeEventListener('click', onClick);
    };
  });
  return `<button ${ref}>${children}</button>`;
});

const Logger = makeComponent(({ currentValue }, { hook }) => {
  hook(() => {
    console.info(`Current value: ${currentValue}`);
  });
  return '';
});

const rootElement = document.querySelector('#root');

const makeTree = currentValue => {
  const increase = () => {
    const nextValue = currentValue + 1;
    render(makeTree(nextValue), rootElement);
  };

  return `
    ${Layout({
      title: '<h1>Counter</h1>',
      children: [
        `<h2>Current value: ${currentValue}</h2>`,
        Button({ children: '+', onClick: increase }),
      ],
      footer: '<span>built with Renderere</span>',
    })}
    ${Logger({ currentValue })}
  `;
};

const initialValue = 0;
render(makeTree(initialValue), rootElement);
