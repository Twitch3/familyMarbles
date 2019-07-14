import { Game } from 'boardgame.io/core';
import { Deck } from '../Classes/Deck';
import { Marble } from '../Classes/Marble';
import { Cell } from '../Classes/Cell';
import { GameBoard } from '../GameBoard/GameBoard';

function isVictory(cells) {
    return false;
}

const Marbles = Game({
    setup: (settings) => {
        const newDeck = new Deck();
        const newNextDrawableCard = newDeck.getNextDrawableCard();
        const players = [];
        const cellMap = {};
        let firstCell;
        let currentCell;
        let previousCell;
        for (let i = 0; i < settings.numPlayers; i++) {
            const hand = [];
            const marbles = [];
            const baseCells = [];
            for (let j = 0; j < 5; j++) {
                hand.push(newDeck.draw());
                const marble = new Marble(i, j);
                const cell = new Cell(i, j, GameBoard.CELL_TYPES.BASE);
                cell.setMarbleInCell(marble);
                marbles.push(marble);
                baseCells.push(cell);
                cellMap[cell.getCellId()] = cell;
            }
            players.push({
                id: i,
                hand: hand,
                marbles: marbles,
                baseCells: baseCells
            });
            
            for(let j = 0; j < 18; j++) {
                currentCell = new Cell(i, j, GameBoard.CELL_TYPES.MAIN);
                cellMap[currentCell.getCellId()] = currentCell;

                if (!firstCell) {
                    firstCell = currentCell;
                }

                if (!previousCell) {
                    previousCell = currentCell;
                } else {
                    currentCell.setPreviousCell(previousCell);
                    previousCell.setNextCell(currentCell);
                    previousCell = currentCell;
                }

                if (j === 3) {
                    let firstHomeCell;
                    let currentHomeCell;
                    let previousHomeCell;
                    for (let k = 0; k < 5; k++) {
                        currentHomeCell = new Cell(i, k, GameBoard.CELL_TYPES.HOME);
                        cellMap[currentHomeCell.getCellId()] = currentHomeCell;

                        if (!firstHomeCell) {
                            firstHomeCell = currentHomeCell;
                        }

                        if (!previousHomeCell) {
                            previousHomeCell = currentHomeCell;
                        } else {
                            // TODO: Is setPreviousCell necessary? We don't travel backwards in the Home
                            currentHomeCell.setPreviousCell(previousHomeCell);
                            previousHomeCell.setNextCell(currentHomeCell);
                            previousHomeCell = currentHomeCell;
                        }
                    }
                    currentCell.setHomeCell(firstHomeCell)
                } else if (j === 8) {
                    for (let k = 0; k < 5; k ++) {
                        const baseCell = cellMap[i + '/' + k + '/' + GameBoard.CELL_TYPES.BASE];
                        baseCell.setNextCell(currentCell);
                    }
                }
            }
        }
        firstCell.setPreviousCell(currentCell);
        currentCell.setNextCell(firstCell);
        return ({
            deck: newDeck,
            lastPlayedCard: undefined,
            nextDrawableCard: newNextDrawableCard,
            numPlayers: settings.numPlayers,
            players: players,
            cellMap: cellMap
        });
    },

    moves: {    
        updateAfterMove(G, ctx) {
            // TODO: Handle ending a turn here. The player has just made a valid move.
        },
    },

    flow: {
        endGameIf: (G, ctx) => {
            if (isVictory(G.cells)) {
                return { winner: ctx.currentPlayer };
            }
        },
    },
});



export default Marbles;