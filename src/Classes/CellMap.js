import { Cell } from './Cell';
import { GameBoard } from '../GameBoard/GameBoard';

export class CellMap {
    constructor(numPlayers) {
        this.map = {};
        let firstCell;
        let currentCell;
        let previousCell;
        for (let i = 0; i < numPlayers; i++) {
            const baseCells = [];
            for (let j = 0; j < 5; j++) {
                const cell = new Cell(i, j, GameBoard.CELL_TYPES.BASE);
                baseCells.push(cell);
                this.map[cell.getCellId()] = cell;
            }
            
            for(let j = 0; j < 18; j++) {
                currentCell = new Cell(i, j, GameBoard.CELL_TYPES.MAIN);
                this.map[currentCell.getCellId()] = currentCell;

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
                        this.map[currentHomeCell.getCellId()] = currentHomeCell;

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
                        const baseCell = this.map[i + '/' + k + '/' + GameBoard.CELL_TYPES.BASE];
                        baseCell.setNextCell(currentCell);
                    }
                }
            }
        }
        firstCell.setPreviousCell(currentCell);
        currentCell.setNextCell(firstCell);
    }

    getMap() {
        return this.map;
    }

    getCellById(id) {
        return this.map[id];
    }

    getCell(playerId, cellIndex, cellType) {
        const id = playerId + '/' + cellIndex + '/' + cellType;
        return this.map[id];
    }

    getMarbleInCell(id) {
        const cell = this.map[id];
        if (cell) {
            return cell.getMarbleInCell();
        } else {
            return undefined;
        }
    }
    
}