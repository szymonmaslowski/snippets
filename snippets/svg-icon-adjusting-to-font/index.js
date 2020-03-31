import dachshundSvg from './dachshund.svg';

const styles = `
  .svg-icon svg {
    fill: currentColor;
    height: 1em;
    position: relative;
    top: .125em;
    width: 1em;
  }
  
  .large {
    font-size: 20px;
  }
  .huge {
    font-size: 32px;
  }
  .green {
    color: green;
  }
  .red {
    color: red;
  }
`;

const dachshundIcon = `<span class="svg-icon">${dachshundSvg}</span>`;

const markup = `
  <span>It is a dachshund ${dachshundIcon}</span>
  <br />
  <span class="large green">It is a dachshund ${dachshundIcon}</span>
  <br />
  <span class="huge red">It is a dachshund ${dachshundIcon}</span>
`;

const stylesElement = document.createElement('style');
stylesElement.innerHTML = styles;
document.head.appendChild(stylesElement);
document.querySelector('#root').innerHTML = markup;
