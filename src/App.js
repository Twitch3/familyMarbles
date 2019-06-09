import { Client } from 'boardgame.io/react';
import { Game } from 'boardgame.io/core';
import { GameBoard } from './GameBoard/GameBoard'

function matchThreeCellIndexes(cells, a, b, c) {
  const cellA = cells[a];
  const cellB = cells[b];
  const cellC = cells[c];
  if (cellA === cellB && cellB === cellC && cellC !== null) {
    return true;
  }
  return false;
}

function isVictory(cells) {
  return matchThreeCellIndexes(cells, 0, 1, 2);
}

function isDraw(cells) {
  return cells.filter(c => c === null).length === 0;
}

const Marbles = Game({
  setup: () => ({ cells: Array(9).fill(null) }),

  moves: {
    clickCell(G, ctx, id) {
      if (G.cells[id] === null) {
        G.cells[id] = ctx.currentPlayer;
      }
    },
  },

  flow: {
    endGameIf: (G, ctx) => {
      if (isVictory(G.cells)) {
        return { winner: ctx.currentPlayer };
      }
      if (isDraw(G.cells)) {
        return { draw: true };
      }
    },
  },
});

const App = Client({ game: Marbles, board: GameBoard, debug: false });

export default App;