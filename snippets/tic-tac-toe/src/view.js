import { makeComponent, render } from '@snippets/renderere';
import {
  cellStateCircle,
  cellStateCross,
  cellStateEmpty,
  gameStatusDraw,
  gameStatusFinished,
  gameStatusPlaying,
  getNextState,
} from './logic';

const Cell = makeComponent(({ state, onClick }, { hook }) => {
  if (![cellStateEmpty, cellStateCross, cellStateCircle].includes(state)) {
    throw new Error(`Invalid cell state "${state}"`);
  }
  const content = {
    [cellStateEmpty]: '',
    [cellStateCross]: 'X',
    [cellStateCircle]: 'O',
  }[state];

  const ref = hook(element => {
    element.addEventListener('click', onClick);
    return () => {
      element.removeEventListener('click', onClick);
    };
  });

  return `<div class="cell" ${ref}>${content}</div>`;
});

const Row = makeComponent(
  ({ children }) => `<div class="row">${children}</div>`,
);

const Board = makeComponent(
  ({ children }) =>
    `<div class="container"><div class="board">${children}</div></div>`,
);

const StateToPlayer = makeComponent(
  ({ state }) => ({ [cellStateCircle]: 'O', [cellStateCross]: 'X' }[state]),
);

const ResultOverlay = makeComponent(
  ({ gameStatus, winner, onRetry }, { hook }) => {
    const ref = hook(element => {
      if (!element) return () => {};
      element.addEventListener('click', onRetry);
      return () => {
        element.removeEventListener('click', onRetry);
      };
    });
    if (gameStatus === gameStatusPlaying) return '';
    const playerName = {
      [cellStateCircle]: 'Circle',
      [cellStateCross]: 'Cross',
    }[winner];
    const message = {
      [gameStatusFinished]: `${playerName} won!`,
      [gameStatusDraw]: "It's a draw!",
    }[gameStatus];
    return `
    <div class="container result-overlay">
      <div class="result-overlay-message ${
        gameStatus === gameStatusFinished
          ? 'result-overlay-message--bordered'
          : ''
      }">${message}</div>
      <div class="result-overlay-message"></div>
      <div class="result-overlay-again-button" ${ref}>again?</div>
    </div>`;
  },
);

const makeTree = ({ paint, reset, state }) => {
  const { boardState, currentCellStateToSet, gameStatus, winner } = state;
  const makeOnClick = coordinates => () => {
    const nextState = getNextState({
      coordinates,
      state,
    });
    paint({ reset, state: nextState });
  };
  return `
    ${Board({
      children: [
        `<span>It's turn of the ${StateToPlayer({
          state: currentCellStateToSet,
        })}</span>`,
        ...boardState.map((row, rowIndex) =>
          Row({
            children: row.map((cell, cellIndex) =>
              Cell({
                state: cell,
                onClick: makeOnClick({ row: rowIndex, cell: cellIndex }),
              }),
            ),
          }),
        ),
      ],
    })}
    ${ResultOverlay({ gameStatus, winner, onRetry: reset })}
  `;
};

const makePaint = element => {
  const paint = ({ reset, state }) =>
    render(makeTree({ paint, reset, state }), element);
  return paint;
};

export default makePaint;
