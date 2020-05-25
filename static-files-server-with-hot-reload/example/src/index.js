import { css } from 'emotion';

const headerClassName = css`
  text-align: center;
`;

const rootDomNode = document.querySelector('#root');
if (!rootDomNode) throw new Error(`Couldn't find root element`);

rootDomNode.innerHTML = `<h1 class="${headerClassName}">Hello world</h1>`;
