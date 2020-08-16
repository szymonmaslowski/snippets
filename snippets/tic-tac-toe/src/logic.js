const gameStatusDraw = 'draw';
const gameStatusFinished = 'finished';
const gameStatusPlaying = 'playing';

const cellStateEmpty = 'empty';
const cellStateCross = 'cross';
const cellStateCircle = 'circle';

const initialState = {
  boardState: [
    [cellStateEmpty, cellStateEmpty, cellStateEmpty],
    [cellStateEmpty, cellStateEmpty, cellStateEmpty],
    [cellStateEmpty, cellStateEmpty, cellStateEmpty],
  ],
  currentCellStateToSet: cellStateCircle,
  gameStatus: gameStatusPlaying,
  winner: null,
};

const isWinConditionMet = (cells, requiredCellsCount) =>
  cells
    .slice(0, cells.length - (requiredCellsCount - 1))
    .some(
      (expectedState, index) =>
        expectedState !== cellStateEmpty &&
        cells
          .slice(index + 1, requiredCellsCount)
          .every(state => state === expectedState),
    );

const isItWinningMove = boardState =>
  // win in row
  boardState.some(row => isWinConditionMet(row, 3)) ||
  // win in col
  boardState[0].some((_, colIndex) =>
    isWinConditionMet(
      boardState.reduce((acc, row) => acc.concat(row[colIndex]), []),
      3,
    ),
  ) ||
  // win in diagonal left to right
  isWinConditionMet(
    boardState.reduce((acc, row, index) => acc.concat(row[index]), []),
    3,
  ) ||
  // win in diagonal right to left
  isWinConditionMet(
    boardState.reduce(
      (acc, row, index, self) => acc.concat(row[self.length - 1 - index]),
      [],
    ),
    3,
  );

const calculateNextBoardState = ({ coordinates, boardState, cellStateToSet }) =>
  boardState.map((row, rowIndex) =>
    row.map((cell, cellIndex) => {
      const thisIsChosenCell =
        rowIndex === coordinates.row && cellIndex === coordinates.cell;
      return thisIsChosenCell ? cellStateToSet : cell;
    }),
  );

const getNextState = ({ coordinates, state }) => {
  const { boardState, currentCellStateToSet, winner } = state;
  const cellIsEmpty =
    boardState[coordinates.row][coordinates.cell] === cellStateEmpty;
  if (!cellIsEmpty || winner) return state;

  const nextBoardState = calculateNextBoardState({
    coordinates,
    boardState,
    cellStateToSet: currentCellStateToSet,
  });

  const itWasWinningMove = isItWinningMove(nextBoardState);
  const noEmptyCellLeft = nextBoardState.every(row =>
    row.every(cell => cell !== cellStateEmpty),
  );

  const nextGameStatus = [
    { status: gameStatusFinished, condition: itWasWinningMove },
    { status: gameStatusDraw, condition: noEmptyCellLeft },
    { status: gameStatusPlaying, condition: true },
  ].find(option => option.condition).status;
  const nextWinner = itWasWinningMove ? currentCellStateToSet : null;

  const nextCurrentCellStateToSet = {
    [cellStateCircle]: cellStateCross,
    [cellStateCross]: cellStateCircle,
  }[currentCellStateToSet];

  return {
    boardState: nextBoardState,
    currentCellStateToSet: nextCurrentCellStateToSet,
    gameStatus: nextGameStatus,
    winner: nextWinner,
  };
};

export {
  gameStatusDraw,
  gameStatusFinished,
  gameStatusPlaying,
  cellStateCircle,
  cellStateCross,
  cellStateEmpty,
  initialState,
  getNextState,
};
