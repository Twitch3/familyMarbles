import { Cell, ICell } from "./Cell";
import { IMarble } from "./Marble";

export interface ICellMap {
  map: {
    [key: string]: ICell;
  };
  numPlayers: number;
}

export class CellMap {
  static buildCellMap(numPlayers: number): ICellMap {
    const cellMap: ICellMap = {
      map: {},
      numPlayers: numPlayers,
    };
    let firstCell: ICell | undefined;
    let currentCell: ICell | undefined;
    let previousCell: ICell | undefined;
    for (let i = 0; i < numPlayers; i++) {
      const baseCells = [];
      for (let j = 0; j < 5; j++) {
        const cell: ICell = Cell.buildCell(i, j, Cell.TYPES.BASE);
        baseCells.push(cell);
        cellMap.map[cell.id] = cell;
      }

      for (let j = 0; j < 18; j++) {
        currentCell = Cell.buildCell(i, j, Cell.TYPES.MAIN);
        cellMap.map[currentCell.id] = currentCell;

        if (!firstCell) {
          firstCell = currentCell;
        }

        if (!previousCell) {
          previousCell = currentCell;
        } else {
          currentCell.previousCellId = previousCell.id;
          previousCell.nextCellId = currentCell.id;
          previousCell = currentCell;
        }

        if (j === 3) {
          let firstHomeCell: ICell | undefined;
          let currentHomeCell: ICell | undefined;
          let previousHomeCell: ICell | undefined;
          for (let k = 0; k < 5; k++) {
            currentHomeCell = Cell.buildCell(i, k, Cell.TYPES.HOME);
            cellMap.map[currentHomeCell.id] = currentHomeCell;

            if (!firstHomeCell) {
              firstHomeCell = currentHomeCell;
            }

            if (!previousHomeCell) {
              previousHomeCell = currentHomeCell;
            } else {
              // TODO: Is setPreviousCell necessary? We don't travel backwards in the Home
              currentHomeCell.previousCellId = previousHomeCell.id;
              previousHomeCell.nextCellId = currentHomeCell.id;
              previousHomeCell = currentHomeCell;
            }
          }
          currentCell.homeCellId = firstHomeCell?.id;
        } else if (j === 8) {
          for (let k = 0; k < 5; k++) {
            // TODO: We can probalby just set the ID directly instead of fetching the cell since we'll be updating away from classes
            const baseCell = cellMap.map[i + "/" + k + "/" + Cell.TYPES.BASE];
            baseCell.nextCellId = currentCell.id;
          }
        }
      }
    }
    // Close the loop
    if (firstCell && currentCell) {
      firstCell.previousCellId = currentCell.id;
      currentCell.nextCellId = firstCell.id;
    }

    return cellMap;
  }

  static moveMarbleBetweenCells(
    cellMap: ICellMap,
    initialCell: ICell,
    targetCell: ICell
  ) {
    const potentialMarble = CellMap.getMarbleInMapCell(cellMap, initialCell);
    CellMap.setMarbleInMapCell(cellMap, potentialMarble, targetCell);
    CellMap.setMarbleInMapCell(cellMap, undefined, initialCell);
  }

  static setMarbleInMapCell(
    cellMap: ICellMap,
    marble: IMarble | undefined,
    targetCell: ICell
  ) {
    cellMap.map[targetCell.id].marble = marble;
  }

  static getMarbleInMapCell(
    cellMap: ICellMap,
    cell: ICell
  ): IMarble | undefined {
    const cellId: string = cell.id;
    return cellMap.map[cellId]?.marble;
  }

  static getMarbleInMapCellFromKey(
    cellMap: ICellMap,
    cellId: string
  ): IMarble | undefined {
    return cellMap.map[cellId]?.marble;
  }

  static getMapCell(cellMap: ICellMap, cellId: string): ICell {
    return cellMap.map[cellId];
  }

  static getNextCell(cellMap: ICellMap, cell: ICell): ICell {
    return CellMap.getMapCell(cellMap, cell.nextCellId as string);
  }

  static getPreviousCell(cellMap: ICellMap, cell: ICell): ICell | void {
    return CellMap.getMapCell(cellMap, cell.previousCellId as string);
  }

  static getMarblesOnMainBoard(cellMap: ICellMap) {
    const marblesOnMainBoard = [];
    for (let i = 0; i < cellMap.numPlayers; i++) {
      for (let j = 0; j < 18; j++) {
        const key: string = i + "/" + j + "/" + Cell.TYPES.MAIN;
        const cell = CellMap.getMapCell(cellMap, key);
        const marble = CellMap.getMarbleInMapCell(cellMap, cell);
        if (marble) {
          marblesOnMainBoard.push(marble);
        }
      }
    }
    return marblesOnMainBoard;
  }
}
