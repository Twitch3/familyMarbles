import { IMarble } from "./Marble";

export interface ICell {
  playerId: number;
  cellIndex: number;
  cellType: number;
  nextCellId?: string;
  previousCellId?: string;
  homeCellId?: string;
  marble?: IMarble;
  id: string;
}

export class Cell {
  //TODO: Change to enum please;

  static TYPES = {
    MAIN: 0,
    BASE: 1,
    HOME: 2,
  };

  static buildCell(playerId: number, index: number, cellType: number): ICell {
    return {
      playerId: playerId,
      cellIndex: index,
      cellType: cellType,
      id: playerId + "/" + index + "/" + cellType,
      marble: undefined
    };
  }
}
